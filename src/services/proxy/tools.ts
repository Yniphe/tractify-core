import http from "node:http";
import lily from "lil-uri";

function getRequestParameters(req: http.IncomingMessage, ssl?: boolean) {
  const url = req.url || "/";
  const host = req.headers["host"];

  if (!url || !host) {
    return undefined;
  }

  const requestUrlInfo = lily(url);

  const baseConnectionInfo = {
    host: requestUrlInfo.hostname(),
    port: requestUrlInfo.port(),
  };

  if (!baseConnectionInfo.host) {
    const headerHostInfo = lily(host);

    baseConnectionInfo.host = headerHostInfo.hostname();
    baseConnectionInfo.port = headerHostInfo.port();
  }

  if (!baseConnectionInfo.host) {
    return undefined;
  }

  let basePath = requestUrlInfo.path() || "/";
  const query = requestUrlInfo.search();

  if (query) {
    basePath = basePath
      .concat("?")
      .concat(new URLSearchParams(query as any).toString());
  }

  return {
    host: baseConnectionInfo.host,
    port: baseConnectionInfo.port || (ssl ? 443 : 80),
    path: basePath,
    params: requestUrlInfo.query() || {},
  };
}

function isSecuredRequest(head?: Buffer): boolean {
  const version = head?.[0];
  return version == 0x16 || version == 0x80 || version == 0x00;
}

export { getRequestParameters, isSecuredRequest };
