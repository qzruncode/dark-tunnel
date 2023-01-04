1. 命令

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
  dark run -m Pro -url /

dark init 下载项目模板
示例：
  dark init sophic-template
```

2. 代理

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

3. 别名

```
项目根目录新建alias.config.js文件

const path = require('path');
module.exports = {
  $components: path.resolve('./src/component/'),
  $asset: path.resolve('./src/asset'),
};
```

4. static文件夹

```
此文件中的文件最终会被复制到build文件夹中
```

5. html模板

```
使用了InterpolateHtmlPlugin对 %PUBLIC_URL% 变量进行替换
```