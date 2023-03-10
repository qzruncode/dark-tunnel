[![NPM version](https://img.shields.io/npm/v/dark-tunnel.svg)](https://www.npmjs.com/package/dark-tunnel)
[![NPM package](https://img.shields.io/npm/dy/dark-tunnel.svg)](https://www.npmjs.com/package/dark-tunnel)

## dark-tunnel前端构建工具

> 此工具用来快速初始化前端项目模板，避免繁琐的重复配置

### 支持的项目模板

1. [sophic-template](https://www.npmjs.com/package/sophic-template) 此为[sophic](https://www.npmjs.com/package/sophic)微前端框架的子应用模板
2. [sophic-master-template](https://www.npmjs.com/package/sophic-master-template) 此为sophic微前端框架的主应用模板
3. [dark-tunnel-base-template](https://www.npmjs.com/package/dark-tunnel-base-template) 此为dark-tunnel的react应用模板
4. [ewchart-base-template](https://www.npmjs.com/package/ewchart-base-template) 此为[ewchart](https://www.npmjs.com/package/ewchart)的示例模板
5. 更多模板待开发...


### 模板下载示例

```
mkdir reactDemo
cd reactDemo
dark init dark-tunnel-base-template
npm install
npm start
```

### 支持的命令

```
dark --help
dark run 运行项目或者编译项目
dark run --help 查看此命令参数
  -m 指定编译模式 Dev ｜ Pro
  -url 指定 PUBLIC_URL
  -c 开启运行时检查
  -r 开启px转换成rem
  -H 开启HTTPS
  -h 设置开发环境的HOST
示例：
  开发：dark run -m Dev -h emonitor.local.elenet.me -H -url /
  生产：dark run -m Pro -url /

dark init 下载项目模板
示例：
  dark init sophic-template
```

### 代理配置

```
项目根目录新建proxy.js文件

module.exports = {
  "/api1": 'https://target-ip:8080' // 代理 /api1 请求 https://target-ip:8080/api1
  "/api2": {
    target: 'http://target-ip:3000',
    pathRewrite: {'^/api' : ''} // 代理 /api2 请求 https://target-ip:3000/
  }
}
```

### 别名配置

```
项目根目录新建alias.config.js文件

const path = require('path');
module.exports = {
  $components: path.resolve('./src/component/'),
  $asset: path.resolve('./src/asset'),
};
```

### 静态文件

```
项目根目录的static文件夹中的文件最终会被复制到build文件夹中
```

### html模板变量

```
使用了InterpolateHtmlPlugin对 %PUBLIC_URL% 变量进行替换
```
   