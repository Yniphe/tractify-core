import HtmlWebpackPlugin from "html-webpack-plugin";
import TsConfigPaths from "tsconfig-paths-webpack-plugin";
import { VueLoaderPlugin } from "vue-loader";
import path from "node:path";

export default {
  mode: "development",
  entry: "./www/vue.config.ts",
  output: { path: path.resolve(__dirname, "../build/www") },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              esModule: false,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.cjs.js",
    },
    plugins: [new TsConfigPaths()],
    extensions: ["*", ".js", ".vue", ".json", ".tsx"],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: process.env.npm_package_name,
      templateContent: `
        <div id="app">
          <router-view></router-view>
        </div>
      `,
    }),
  ],
};
