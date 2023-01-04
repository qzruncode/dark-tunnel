const { MiniCssExtractPlugin } = require("./plugins");

const publicUrl = process.env.PUBLIC_URL;
const isDev = process.env.mode === "Dev" ? true : false;
const isUseRem = process.env.isUseRem === "false" ? false : true;
const babelLoaderConf = {
  loader: require.resolve("babel-loader"),
  options: {
    presets: [
      [
        require.resolve("@babel/preset-env"),
        { useBuiltIns: "usage", corejs: "3.27", debug: false },
      ],
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-typescript"),
    ],
    plugins: [
      [require.resolve("@babel/plugin-proposal-decorators"), { legacy: true }],
      require.resolve("@babel/plugin-proposal-class-properties"),
    ],
    cacheDirectory: true, // babel编译后的内容默认缓存在 node_modules/.cache/babel-loader
  },
};

const remConfig = isUseRem
  ? [
      [
        require.resolve("postcss-pxtorem"),
        {
          rootValue: 100,
          minPixelValue: 2,
          replace: true,
          propList: ["*"],
        },
      ],
    ]
  : [];


module.exports = [
  {
    test: /\.l?[ec]ss$/i,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: { publicPath: publicUrl },
      },
      {
        loader: require.resolve("css-loader"),
        options: {
          sourceMap: isDev,
          importLoaders: 1,
          modules: false,
        },
      },
      {
        loader: require.resolve("postcss-loader"),
        options: {
          sourceMap: isDev,
          postcssOptions: {
            plugins: [
              require.resolve("postcss-preset-env"),
              require.resolve("postcss-import"),
              ...remConfig,
            ],
          },
        },
      },
      {
        loader: require.resolve("less-loader"),
        options: {
          lessOptions: {
            javascriptEnabled: true,
            sourceMap: isDev,
          },
        },
      },
    ],
    sideEffects: true,
  },
  {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
    generator: {
      // 文件生成到 image 目录下
      filename: "image/[hash][ext][query]",
    },
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          presets: [require.resolve("@babel/preset-react")],
        },
      },
      {
        loader: require.resolve("@svgr/webpack"),
        options: {
          babel: false,
          icon: true,
        },
      },
    ],
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: "asset/resource",
    generator: {
      // 文件生成到 font 目录下
      filename: "font/[hash][ext][query]",
    },
  },
  {
    test: /\.(js|ts|tsx)?$/,
    exclude: /(node_modules|config|public|build|env|static)/,
    use: [
      {
        loader: require.resolve("thread-loader"),
        options: {
          workers: 4,
          workerParallelJobs: 100,
        },
      },
      babelLoaderConf,
    ],
  },
];
