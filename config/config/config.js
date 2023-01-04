const Helper = require("./combine/helper");
const path = require("path");
const {
  output,
  resolve,
  optimization,
  plugins,
  loaders,
} = require("./combine");

const buildConfig = (plugin = []) => {
  const isDev = process.env.mode === "Dev" ? true : false;
  const commonConfig = {
    target: "web",
    stats: "errors-warnings",
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve(Helper.resolveApp("./"), '.temp_cache'),
    },
    context: Helper.resolveApp("./"), // 解析entry和loader的根目录
    entry: "./src/index.tsx",
    output,
    resolve,
    optimization,
    plugins: plugins.concat(plugin),
    module: {
      rules: [{
        oneOf: loaders,
      }],
    },
  };
  const devConfig = {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
  };

  const proConfig = {
    mode: "production",
    devtool: "cheap-module-source-map",
  };

  commonConfig.optimization.chunkIds = isDev ? "named" : "deterministic";
  const config = Object.assign({}, commonConfig, isDev ? devConfig : proConfig);
  return config;
};

module.exports = buildConfig;
