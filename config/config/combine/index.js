const Helper = require('./helper');;
const { plugins } = require('./plugins');
const loaders = require('./loaders');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const aliasConfig = require(Helper.resolveApp("./alias.config.js"));

const publicUrl = process.env.PUBLIC_URL;

exports.output = {
  path: Helper.resolveApp('build'),
  filename: 'js/[name].[contenthash].js',
  chunkFilename: 'js/[name].[contenthash].js',
  publicPath: publicUrl,
  clean: true,
  pathinfo: false,
};

exports.resolve = {
  // symlinks: false,
  extensions: ['.ts', '.tsx', '.js'],
  modules: [
    // 设置解析模块时要查找的路径
    'node_modules',
    Helper.resolveApp('node_modules'),
    Helper.resolveApp('src'),
  ],
  alias: {
    '@': Helper.resolveApp('src'),
    react: Helper.resolveApp('node_modules/react'),
    ...aliasConfig,
  }
};

exports.optimization = {
  moduleIds: 'deterministic',
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'initial', // 异步导入的组件不要使用此拆包规则
    cacheGroups: {
      bigSize: {
        minSize: 200000,
        name(module, chunks, cacheGroupKey) {
          const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item);
          const allChunksNames = chunks.map((item) => item.name).join('~');
          return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        },
        reuseExistingChunk: true,
      },
    },
  },
  minimizer: [
    `...`, // 必须要添加这个，否则内置的teser会被覆盖
    new CssMinimizerPlugin(),
  ],
};

exports.plugins = plugins;
exports.loaders = loaders;
exports.Helper = Helper;