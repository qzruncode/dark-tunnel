const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolveApp } = require('./helper');
const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');
const WebpackBar = require('webpackbar');
const GenerateUidWebpackPlugin = require('../../plugin/uid');

exports.MiniCssExtractPlugin = MiniCssExtractPlugin;
const isDev = process.env.mode === 'Dev' ? true : false;
const publicUrl = process.env.PUBLIC_URL;
const isRuntimeCheck = process.env.isRuntimeCheck === 'false' ? false : true;

const checkConfig = isRuntimeCheck ? [
  new ForkTsCheckerWebpackPlugin({
    typescript: {
      context: process.cwd(),
      configFile: path.join(process.cwd(), 'tsconfig.json'),
      typescriptPath: require.resolve('typescript'),
    },
  }),
  new ESLintPlugin({
    cwd: process.cwd(),
    extensions: ['js', 'ts', 'tsx'],
    files: './src/**/*.{tsx,ts,js}',
    overrideConfigFile: path.join(process.cwd(), '.eslintrc.js'),
    baseConfig: {},
  }),
] : [];

exports.plugins = [
  new WebpackBar(),
  new CopyPlugin({
    patterns: [{ from: 'static', to: resolveApp('build') }],
  }),
  new HtmlWebpackPlugin({ template: './public/index.html' }),
  new InterpolateHtmlPlugin({
    PUBLIC_URL: publicUrl.slice(0, -1),
  }),
  new Dotenv(),
  new MiniCssExtractPlugin({
    filename: 'css/[name].[contenthash].css',
    chunkFilename: 'css/[id].[contenthash].css',
  }),
  ...checkConfig,
  new GenerateUidWebpackPlugin(),
]