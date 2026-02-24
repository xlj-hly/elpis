const glob = require('glob')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const pagesPath = path.resolve(process.cwd(), './app/pages') // 页面目录路径
const pageTemplatePath = path.resolve(process.cwd(), './app/view/entry.html') // 页面模板路径
const entryPattern = '**/entry.*.js' // 入口文件匹配模式

/** @type {Record<string, string>} */
const pageEntries = {} // 入口文件列表
/** @type {import('html-webpack-plugin')[]} */
const htmlWebpackPluginList = [] // html 页面构建列表

glob
  // 获取 app/pages 目录下的所有入口文件
  .sync(entryPattern, { cwd: pagesPath })
  // 将入口文件路径转换为绝对路径
  .map((f) => path.resolve(pagesPath, f))
  // 遍历所有入口文件
  .forEach((f) => {
    const entryName = path.basename(f, '.js')
    // 构造 entry
    pageEntries[entryName] = f
    // 构造 html 页面文件
    htmlWebpackPluginList.push(
      new HtmlWebpackPlugin({
        // 产物 (最终模板) 输出路径
        filename: path.resolve(
          process.cwd(),
          './app/public/dist/',
          `${entryName}.html`
        ),
        // 指定使用的模板文件
        template: pageTemplatePath,
        // 要注入的代码块
        chunks: [entryName],
      })
    )
  })

/**
 * webpack 基础配置
 *
 * @type {import('webpack').Configuration}
 */
module.exports = {
  // 入口配置
  entry: pageEntries,

  // 模块解析配置 (加载哪些模块，用什么方式解析)
  module: {
    rules: [
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.js$/,
        // 只处理 app/pages 目录下的 js 文件
        include: path.resolve(process.cwd(), './app/pages'),
        use: 'babel-loader',
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10KB，小于此大小的文件将内联为 data URI
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        type: 'asset/resource',
      },
    ],
  },

  // 产物输出路径
  output: {},

  // 配置模块解析行为 (打包时如何解析具体模块路径) import { xxx } from a/b/c => a/b/c.xx(js | vue | ...)
  resolve: {
    extensions: ['.js', '.vue', '.less', '.scss', '.css'],
    alias: {
      '@pages': path.resolve(process.cwd(), './app/pages'),
      '@common': path.resolve(process.cwd(), './app/pages/common'),
      '@widgets': path.resolve(process.cwd(), './app/pages/widgets'),
      '@store': path.resolve(process.cwd(), './app/pages/store'),
    },
  },

  // 配置插件
  plugins: [
    // VueLoaderPlugin 用于处理 .vue 单文件组件，支持在 webpack 构建过程中解析 .vue 文件的模板、脚本和样式，
    // 并将其转化为可被打包的 JavaScript 代码。
    new VueLoaderPlugin(),
    // 自动加载 Vue 模块
    new webpack.ProvidePlugin({
      Vue: 'vue',
      axios: 'axios',
      _: 'lodash',
    }),
    // 定义全局变量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true, // 启用 Vue 选项 API
      __VUE_PROD_DEVTOOLS__: false, // 禁用 Vue 生产环境中的开发工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false, // 禁用 Vue 生产环境中的 hydration(水合) 信息
    }),
    // 构造 html 页面文件列表
    ...htmlWebpackPluginList,
  ],

  // 配置打包优化 (代码分割、模块合并、缓存、Tree Shaking、代码压缩等策略)
  optimization: {
    /**
     * 1. vendor: 第三方库打包
     * 2. common: 公共模块打包
     * 3. entry.{page}: 页面差异代码打包
     */
    splitChunks: {
      chunks: 'all', // 同步和异步都进行代码分割
      maxAsyncRequests: 10, // 最大异步请求数
      maxInitialRequests: 10, // 最大初始请求数
      cacheGroups: {
        // 第三方库打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor', // 打包后的文件名
          priority: 2, // 优先级 越小越先打包
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 复用已有的 chunk
        },
        // 公共模块打包
        common: {
          test: /[\\/]common|widgets[\\/]/,
          name: 'common', // 模块名
          minChunks: 2, // 最小引用次数
          minSize: 1, // 最小分割文件大小 (1 byte)
          priority: 1, // 优先级
          reuseExistingChunk: true, // 复用已有的 chunk
        },
      },
    },
    // 将 webpack 运行时生成的代码打包到 runtime.js
    runtimeChunk: true,
  },
}
