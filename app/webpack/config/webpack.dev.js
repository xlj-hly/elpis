const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')

// 基类配置
const BaseConfig = require('./webpack.base')

// dev-server 配置
const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '/__webpack_hmr', // 官方配置
  TIMEOUT: 20000,
}
const BASE_URL = `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}`
// HMR 客户端路径
const HMR_CLIENT_PATH = `webpack-hot-middleware/client?path=${BASE_URL}/${DEV_SERVER_CONFIG.HMR_PATH}?timeout=${DEV_SERVER_CONFIG.TIMEOUT}&reload=true`

// 开发阶段的 entry 配置需要加入 hmr
// @ts-ignore
Object.keys(BaseConfig.entry).forEach((v) => {
  if (v !== 'vendor') {
    // @ts-ignore
    BaseConfig.entry[v] = [
      // 主入口文件
      // @ts-ignore
      BaseConfig.entry[v],
      // hmr 更新入口，官方指定的 hmr 路径
      HMR_CLIENT_PATH,
    ]
  }
})

// 开发环境配置
const webpackConfig = merge(BaseConfig, {
  mode: 'development',
  // 开发环境 source-map 配置 (源码地图，不配置将无法追踪源码，只能追踪打包后的代码)
  // 使用 'eval-source-map' 可以获得更好的调试体验，但构建速度稍慢
  // 使用 'cheap-module-eval-source-map' 可以平衡速度和调试体验
  // 'eval-cheap-module-source-map' 速度最快，但会为每个模块生成独立的 source map
  devtool: 'eval-cheap-module-source-map',
  // 开发环境 output 配置
  output: {
    filename: 'js/[name]_[contenthash:8].bundle.js',
    path: path.resolve(process.cwd(), 'app', 'public', 'dist', 'dev'), // 打包资源输出的绝对路径，指定到开发环境的 dist 目录下
    publicPath: `${BASE_URL}/public/dist/dev`, // 打包资源在浏览器中的公共访问路径
    globalObject: 'this', // 公共对象设置，避免某些库在不同环境下访问不到 window/global
  },
  // 开发阶段插件
  plugins: [
    // HotModuleReplacementPlugin 用于启用 webpack 的热模块替换 (HMR) 功能，
    // 允许在应用程序运行时更新模块，而无需完全重新加载页面。
    new webpack.HotModuleReplacementPlugin(),
  ],
})

module.exports = {
  // webpack 配置
  webpackConfig,
  // dev-server 配置, 暴露给 dev.js 使用
  DEV_SERVER_CONFIG,
}
