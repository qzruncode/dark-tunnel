#!/usr/bin/env node

"use strict";

const program = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const fetch = require("node-fetch");
const path = require("path");
const zlib = require("zlib");
const tar = require("tar");
const mkdirp = require("mkdirp");
const ora = require("ora");
const { resolveApp } = require("../config/config/combine/helper");

program.on("--help", () => {
  console.log(
    `\r\nRun ${chalk.greenBright(
      "dark <command> --help"
    )} for detailed usage of given command.`
  );
});

program
  .command("run")
  .option("-m, --mode [mode]", "指定编译模式 [Dev|Pro]")
  .option("-url, --PUBLIC_URL [PUBLIC_URL]", "配置publicPath")
  .option("-c, --isRuntimeCheck", "是否开启运行时js语法检查")
  .option("-r, --isUseRem", "是否开启px转rem")
  .option("-H, --HTTPS", "是否开启https")
  .option("-h, --HOST [HOST]", "指定项目运行的host")
  .option("-p, --PORT [PORT]", "指定项目运行的端口号")
  .description("运行项目")
  .action((options) => {
    console.log(chalk.greenBright("设置的环境变量"), options);
    process.env.mode = options.mode;
    process.env.PUBLIC_URL = options.PUBLIC_URL;
    process.env.isRuntimeCheck = !!options.isRuntimeCheck;
    process.env.isUseRem = !!options.isUseRem;
    process.env.HTTPS = !!options.HTTPS;
    process.env.HOST = options.HOST;
    process.env.PORT = options.PORT;

    const isDev = process.env.mode === "Dev" ? true : false;
    if (isDev) {
      require("../config/config/server");
    } else {
      // 检查webpack.plugins.js是否存在
      fs.stat(resolveApp("darkTunnel.config.js"), (err, stats) => {
        const config = require("../config/index");
        if (stats) {
          if (stats.isFile()) {
            const plugin = require(resolveApp("darkTunnel.config.js"));
            config(plugin);
          } else {
            config();
          }
        } else {
          config();
        }
      });
    }
  });

program.command("init")
  .description("下载模板")
  .action(async () => {
    const templateName = program.args[1];
    const spinner = ora("正在下载"+templateName).start();
    const pkg = await fetch("https://registry.npmjs.org/" + templateName);;
    const pkgInfo = await pkg.json();
    if (pkgInfo.error) {
      console.log(chalk.red(pkgInfo.error));
    } else {
      const version = pkgInfo["dist-tags"].latest;
      const tarball = pkgInfo.versions[version].dist.tarball;
      const destDir = path.join(process.cwd());
      const pkgTgz = await fetch(tarball);
      const dirs = [];
      const files = [];
      const wss = [];
      pkgTgz.body
        .pipe(zlib.Unzip())
        .pipe(new tar.Parse())
        .on("entry", function (entry) {
          if (entry.type === "Directory") {
            entry.resume();
            return;
          }
          const realPath = entry.path.replace(/^package\//, "");
          let filename = path.basename(realPath);
          filename =
            filename === "_package.json"
              ? filename.replace(/^_/, "")
              : filename.replace(/^_/, ".");
          const destPath = path.join(destDir, path.dirname(realPath), filename);
          const dir = path.dirname(destPath);
          if (!dirs.includes(dir)) {
            dirs.push(dir);
            mkdirp.sync(dir);
          }
          files.push(destPath);
          wss.push(
            new Promise((resolve) => {
              entry
                .pipe(fs.createWriteStream(destPath))
                .on("finish", () => resolve())
                .on("close", () => resolve());
            })
          );
        })
        .on("end", () => {
          Promise.all(wss).then(() => {
            spinner.succeed(templateName+"下载完成");
          });
        });
    }
});

program.parse(process.argv);
