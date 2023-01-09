import Electron from "electron";
import path from "node:path";
import { logger } from "./logger";
import { Proxy } from "./services";
import highlight from "highlight.js";
import prettier from "prettier";

const MAIN_WINDOW_OPTIONS: Electron.BrowserWindowConstructorOptions = {
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    sandbox: true,
  },
  width: 1000,
  height: 600,
  minHeight: 600,
  minWidth: 1000,
  title: "Tractify",
  vibrancy: "light",
  titleBarStyle: "hidden",
  trafficLightPosition: { x: 18, y: 18 },
  visualEffectState: "active",
  frame: false,
  fullscreen: false,
  titleBarOverlay: true,
  fullscreenable: false,
};

export class Application {
  windows: {
    main: Electron.BrowserWindow;
  } = {
    main: new Electron.BrowserWindow(MAIN_WINDOW_OPTIONS),
  };

  constructor() {
    Electron.app.on("window-all-closed", this.terminate);

    // const respinse = highlight.highlightAuto(

    // );

    console.log(
      highlight.highlightAuto(
        prettier.format(
          JSON.stringify({ test: "Hello, World!", name: "test" }),
          {
            parser: "json",
            semi: true,
          }
        )
      )
    );
  }

  async init() {
    if (!Application.isDev) {
      this.windows?.main.loadFile(path.join(__dirname, "../www/index.html"));
      this.mount();

      return;
    }

    const [WebpackConfig, Webpack, WebpackDevServer] = await Promise.all([
      import(path.resolve(__dirname, "../webpack.config.js")),
      import("webpack"),
      import("webpack-dev-server"),
    ]);

    const devServerOptions = {
      ...WebpackConfig.default.devServer,
      open: false,
    };

    const compiler = Webpack.default({
      ...WebpackConfig.default,
      mode: "development",
      stats: "none",
    });

    const server = new WebpackDevServer.default(devServerOptions, compiler);

    await server.start();
    await this.windows?.main.loadURL(
      `http://${server.options.host ?? "localhost"}:${server.options.port}/`
    );

    logger.info("Running in development mode");
    this.mount();

    return;
  }

  async mount() {
    const proxyService = new Proxy();

    proxyService.listen("0.0.0.0", 5050);
  }

  async terminate() {
    Electron.app.quit();
  }

  static get isDev() {
    return process.env.NODE_ENV === "development";
  }
}

Electron.app.on("ready", () => new Application().init());
