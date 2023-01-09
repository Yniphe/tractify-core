import net from "node:net";
import http from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { logger } from "../../logger";
import { ProxyServerOptions } from "./interfaces/proxyServerOptions";
import { Transport } from "./transport";
import { EventEmitter } from "node:events";

export class Proxy extends EventEmitter {
  server: net.Server;
  httpServer: http.Server;
  transports: Map<string, Transport>;
  notification?: NodeJS.Timer;

  constructor(readonly options?: ProxyServerOptions) {
    super();

    this.transports = new Map();
    this.server = net.createServer({ allowHalfOpen: false, keepAlive: false });
    this.httpServer = http.createServer({
      keepAlive: false,
    });

    /**
     * TCP EVENTS
     */
    this.server.on("connection", this.handleConnection.bind(this));
    this.server.on("listening", this.onServerListening.bind(this));

    /**
     * HTTP EVENTS
     */
    this.httpServer.on("connection", this.onHttpConnection.bind(this));
    this.httpServer.on("connect", this.onHttpConnect.bind(this));
    this.httpServer.on("request", this.onHttpRequest.bind(this));
  }

  async handleConnection(socket: any) {
    socket.fingerprint = createHash("md5")
      .update(randomBytes(12))
      .digest("hex");

    this.httpServer.emit("connection", socket.ref());
  }

  onHttpConnection(socket: any) {
    this.transports.set(
      socket.fingerprint,
      new Transport(this, socket.fingerprint, socket)
    );
  }

  onHttpConnect(request: http.IncomingMessage, socket: any, head: Buffer) {
    const transport = this.transports.get(socket.fingerprint);

    /**
     * If transport not found, close socket
     */
    if (!transport) {
      socket.end();
      return;
    }

    /**
     * If transport found, emit http connect event
     */
    transport?.onHttpConnect(request, socket, head);
  }

  onHttpRequest(request: http.IncomingMessage, response: http.ServerResponse) {
    const transport = this.transports.get((request.socket as any).fingerprint);

    /**
     * If transport not found, close socket
     */
    if (!transport) {
      response.end();
      return;
    }

    /**
     * If transport found, emit http request event
     */
    transport?.onHttpRequest(false, request, response);
  }

  onServerListening() {
    const addressInfo = this.server.address() as net.AddressInfo;

    logger.info(
      "Server listening on %s:%s",
      addressInfo.address,
      addressInfo.port
    );

    this.emit("listening", addressInfo);

    /**
     * Notification events
     */
    this.notification = setInterval(() => {
      if (!this.server.listening) {
        return;
      }

      logger.info("Proxy: active %s transports", this.transports.size);
    }, 10000);
  }

  async listen(host: string, port: number) {
    this.server.listen(port, host);
  }

  destroy() {
    this.httpServer.close();
    this.server.close();
    this.transports.clear();

    clearInterval(this.notification);
  }
}
