const webpack = require("webpack");
const buildConfig = require("./config/config");

const config = (plugin = []) => {
  const compiler = webpack(buildConfig(plugin));
  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    // 需要关闭compiler才会生成cache
    compiler.close(closeErr => { 
      closeErr && console.log(closeErr);
    });

    // console.log(stats.toString({ colors: true, env: true, }));
    console.log("编译完成");
  });
};
module.exports = config;
