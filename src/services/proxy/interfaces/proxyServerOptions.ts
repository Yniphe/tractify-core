import { CertificateManager } from "../../certificate";

export interface ProxyServerOptions {
  keepAlive?: boolean;
  ca?: CertificateManager;
}
