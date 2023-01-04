const fs = require("fs-extra");
const Helper = require("../config/combine/helper");
const path = require("path");

class GenerateUidWebpackPlugin {
  constructor(options = {}) {
    const url = path.resolve(Helper.resolveApp("public"), "./uid.js");
    // 检查uid.js是否存在
    fs.access(url, fs.constants.F_OK, (err) => {
      if (!err) {
        // 读取用户目录public下的uid.js文件
        fs.readFile(url, "utf8", (err, data) => {
          this.uidFile = data;
        });
      }
    });
  }

  apply(compiler) {
    compiler.hooks.done.tapPromise(this.constructor.name, ({ compilation }) => {
      const fileContent = this.uidFile.replace(
        /__uid__/g,
        `${new Date().getTime() + Math.random().toString(36).substring(2)}`
      );
      return fs
        .outputFile(
          path.resolve(Helper.resolveApp("build"), "./uid.js"),
          fileContent
        )
        .catch((err) => {
          console.error(err);
        });
    });
  }
}

module.exports = GenerateUidWebpackPlugin;
