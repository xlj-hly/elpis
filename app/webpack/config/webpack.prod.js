const path = require('path')
const { merge } = require('webpack-merge')

const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取 css 公共部分
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin') // 压缩 css
const TerserPlugin = require('terser-webpack-plugin')
// const threadLoader = require('thread-loader') // 多线程打包

// 基类配置
const BaseConfig = require('./webpack.base')

// 生产环境配置
const webpackConfig = merge(BaseConfig, {
  mode: 'production',
  // 生产环境 output 配置
  output: {
    filename: 'js/[name]_[contenthash:8].bundle.js',
    path: path.resolve(process.cwd(), 'app', 'public', 'dist', 'prod'),
    publicPath: '/dist/prod',
    crossOriginLoading: 'anonymous', // 浏览器请求资源时不发送用户凭证
    clean: true, // 每次构建前清理输出目录
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        // 只处理 app/pages 目录下的 js 文件
        include: path.resolve(process.cwd(), './app/pages'),
        // 使用 thread-loader 多进程打包 JS
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
            },
          },
          'babel-loader',
        ],
      },
    ],
  },
  // webpack 性能提示, 默认是 warning, 设置为 false 禁用性能提示
  performance: {
    hints: false, // 禁用性能提示
  },
  plugins: [
    // 提取 css 公共部分 (非公共部分使用 inline)
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].bundle.css',
      chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
    }),
  ],
  optimization: {
    // minimizer 在代码生成后、输出前执行压缩
    // 用于自定义代码压缩工具的配置，数组内可以放置如 TerserPlugin、CSSMinimizerPlugin 等插件。
    minimizer: [
      // 压缩 js
      new TerserPlugin({
        parallel: true, // 多核并发执行
        terserOptions: {
          compress: {
            drop_console: true, // 删除所有 console.* 调用
          },
        },
      }),
      // 压缩 css
      new CSSMinimizerPlugin(),
    ],
    // 压缩代码
    minimize: true,
  },
})

module.exports = webpackConfig
