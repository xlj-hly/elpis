const webpack = require('webpack')
const webpackConfig = require('./config/webpack.prod')

console.log('\nStarting prod...\n')

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error(err)
    return
  }
  process.stdout.write(
    `${stats?.toString({
      colors: true, // 在控制台输出彩色信息
      modules: false, // 不显示模块打包信息
      children: false, // 不显示子级打包信息
      chunks: false, // 不显示每个代码块的信息
      chunkModules: true, // 显示代码块中的模块信息
    })}\n\n`
  )
})
