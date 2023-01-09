import ffi from "ffi-napi";
import path from "node:path";
import findProcess from "find-process";
import { logger } from "tractify";

const OS_EXECUTEBALE_PATH: any = {
  darwin: {
    arm64: path.resolve(__dirname, "shared/helper_arm64.dylib"),
  },
};

const LIBRARY_PATH = OS_EXECUTEBALE_PATH[process.platform][process.arch];

export class NSApplicationRunning {
  private library?: any;

  constructor() {
    try {
      this.library = ffi.Library(LIBRARY_PATH, {
        processInfo: ["string", ["int"]],
      });

      logger.info("Library loaded: %s", LIBRARY_PATH);
    } catch (error) {
      logger.warn("Cant load library: %s", LIBRARY_PATH);
    }
  }

  get isSupportedPlatform() {
    return process.platform in OS_EXECUTEBALE_PATH;
  }

  async processInfoByPort(port: number) {
    const [fpRocess] = await findProcess("port", port.toString());

    if (!fpRocess?.pid) {
      logger.warn("Cant find process by port: %s", port);
      return;
    }

    return this.processInfoByPid(fpRocess.pid);
  }

  async processInfoByPid(processId: number): Promise<
    | {
        name: string;
        executablePath: string;
        icon: string;
      }
    | undefined
  > {
    if (!this.library) {
      logger.warn(
        "method processInfo(int) cannot be called, library not initialized"
      );

      return;
    }

    try {
      const processInfo = this.library.processInfo(processId);
      return JSON.parse(processInfo);
    } catch {
      logger.warn("Cant get process info");
    }

    return;
  }
}
