const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const { Helper } = require("./combine");
const buildConfig = require("./config");

module.exports = (plugin = []) => {
  try {
    const proxy = require(Helper.resolveApp("./proxy.js"));

    const config = buildConfig(plugin);
    const compiler = webpack(config);

    const isHTTPS = process.env.HTTPS === "true" ? true : false;
    const publicUrl = process.env.PUBLIC_URL;

    const configServer = (PORT) => {
      const options = {
        port: PORT,
        https: isHTTPS,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers": "*",
        },
        compress: true,
        open: true,
        hot: true,
        host: process.env.HOST,
        allowedHosts: [process.env.HOST],
        historyApiFallback: {
          disableDotRule: true,
          index: publicUrl,
        },
        devMiddleware: {
          publicPath: publicUrl,
          writeToDisk: false,
        },
        client: {
          logging: "error",
          progress: true,
        },
        static: [
          {
            directory: Helper.resolveApp("static"), // 服务静态文件
            publicPath: publicUrl, // 静态服务前缀
          },
          {
            directory: Helper.resolveApp("build"), // 服务静态文件
            publicPath: publicUrl, // 静态服务前缀
          },
        ],
        proxy,
      };
      const server = new webpackDevServer(options, compiler);
      server.start();
      console.log(`project listening on port ${PORT}!\n`);
    };

    Helper.checkPortIsValid(configServer);
  } catch (error) {
    throw error;
  }
};
