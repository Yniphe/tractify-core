import net from "node:net";
import http from "node:http";
import https from "node:https";
import { logger } from "../../logger";
import { Proxy } from "../proxy";
import { getRequestParameters, isSecuredRequest } from "./tools";
import { ResponsePipe } from "./pipes/response-pipe";
import { RequestPipe } from "./pipes/request-pipe";

export class Transport {
  private httpsServer?: https.Server;
  private redirectSocket?: net.Socket;

  constructor(
    readonly parent: Proxy,
    readonly fingerprint: string,
    readonly socket: net.Socket
  ) {
    this.socket.on("close", this.terminate.bind(this));
  }

  async onHttpConnect(
    request: http.IncomingMessage,
    socket: net.Socket,
    head: Buffer
  ) {
    if (!head?.length) {
      socket.once("data", this.onhttpConnectData.bind(this, request, socket));
      socket.write("HTTP/1.1 200 OK\r\n");

      if (request.headers["proxy-connection"] === "keep-alive") {
        socket.write("Proxy-Transmitter: keep-alive\r\n");
        socket.write("Transmitter: keep-alive\r\n");
      }

      socket.write("\r\n");
      return;
    }

    return this.onhttpConnectData(request, socket, head);
  }

  async onHttpRequest(
    secured: boolean,
    request: http.IncomingMessage,
    response: http.ServerResponse
  ) {
    const parameters = getRequestParameters(request, secured);

    if (!parameters?.host) {
      response.writeHead(400, { "Content-Type": "text/html; charset=utf8" });
      response.end("Bad Request");
      return;
    }

    if (!this.parent.options?.keepAlive) {
      delete request.headers["connection"];
    }

    const proto = secured ? https : http;
    const req = proto.request({
      host: parameters.host,
      port: parameters.port,
      method: request.method,
      path: request.url,
      headers: request.headers,
      agent: false,
    });

    req.on("error", this.onHttpProtoError.bind(this));
    req.on("response", (res) => {
      /**
       * Перенаправляем заголовки ответа и статус
       */
      response.writeHead(res.statusCode!, res.headers);

      /**
       * Перенаправляем тело ответа
       */
      res.pipe(new ResponsePipe(response));
    });

    /**
     * Перенаправляем тело запроса
     */
    request.pipe(new RequestPipe(req));
  }

  async onhttpConnectData(
    request: http.IncomingMessage,
    socket: net.Socket,
    head: Buffer
  ) {
    const isSecured = isSecuredRequest(head);
    const parameters = getRequestParameters(request, isSecured);

    /**
     * Если параметры запроса не были получены, то закрываем соединение
     */
    if (!parameters?.host) {
      return socket.end();
    }

    const addressInfo = {
      address: parameters.host,
      port: parameters.port,
      family: "IPv4",
    };

    if (!isSecured) {
      return this.redirect(socket, head, addressInfo);
    }

    /**
     * Если сертификат не был получен, то выполняем редирект на исходный хост
     */
    const signInfo = await this.parent.options?.ca?.request(
      addressInfo.address
    );

    if (!signInfo) {
      return this.redirect(socket, head, addressInfo);
    }

    /**
     * Если сертификат был получен, то выполняем редирект на зашифрованное соединение
     */

    const httpsCredentials = await this.getSecuredContext({
      cert: signInfo.cert,
      key: signInfo.privateKey,
    });

    return this.redirect(socket, head, httpsCredentials);
  }

  async redirect(
    socket: net.Socket,
    head: Buffer,
    { address: host, port }: net.AddressInfo
  ) {
    socket.pause();

    this.redirectSocket?.destroy();
    this.redirectSocket = net.connect({ port, host, allowHalfOpen: true });

    this.redirectSocket.on("error", this.onRedirectSocketError.bind(this));
    this.redirectSocket.on("close", () => this.terminate.bind(this));
    this.socket.on("error", this.onRedirectSocketError.bind(this));

    this.redirectSocket.on("connect", () => {
      this.redirectSocket?.pipe(socket);
      socket.pipe(this.redirectSocket!);

      socket.emit("data", head);
      socket.resume();
    });
  }

  async getSecuredContext(options: https.ServerOptions) {
    if (!this.httpsServer) {
      this.httpsServer = https.createServer(options);

      this.httpsServer.on("connect", this.onHttpConnect.bind(this));
      this.httpsServer.on("request", this.onHttpRequest.bind(this, true));
      this.httpsServer.on("error", this.onHttpsServerError.bind(this));
    }

    if (this.httpsServer?.listening) {
      return this.httpsServer.address() as net.AddressInfo;
    }

    return new Promise<net.AddressInfo>((resolve) => {
      this.httpsServer?.listen(0, () => {
        resolve(this.httpsServer?.address() as net.AddressInfo);
      });
    });
  }

  async onHttpsServerError(error: Error) {
    logger.info("https server error", error);
  }

  async onHttpProtoError(error: Error) {
    logger.info("http proto error", error);
  }

  async onRedirectSocketError(error: Error) {
    logger.info("redirect socket error", error);
  }

  async terminate() {
    this.socket.destroy();
    this.redirectSocket?.destroy();
    this.httpsServer?.close();
    this.parent.transports.delete(this.fingerprint);

    logger.info("Transport %s terminated", this.fingerprint);
  }
}
