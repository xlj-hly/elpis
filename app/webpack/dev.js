const path = require('path')
const express = require('express')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

// 从 webpack.dev.js 中导入 webpack 配置和 dev-server 配置
const { webpackConfig, DEV_SERVER_CONFIG } = require('./config/webpack.dev')

const app = express()

const compiler = webpack(webpackConfig)

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist')))

// 引入 divMiddleware 中间件 (监控文件改动)
app.use(
  devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (f) => f.endsWith('.html'),

    // 资源路径
    publicPath: webpackConfig.output?.publicPath,

    // headers 配置
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, X-Requested-With',
    },
    stats: {
      colors: true,
    },
  })
)

// 引入 hotMiddleware 中间件 (实现热更新通讯)
app.use(
  // @ts-ignore
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {},
  })
)

console.info('\nStarting dev...\n')

const port = DEV_SERVER_CONFIG.PORT
app.listen(port, () => {
  console.info(`Server is running on http://${DEV_SERVER_CONFIG.HOST}:${port}`)
})
