const path = require('path')

/**
 * config loader
 * @param {Object} app - Koa 实例
 *
 * 配置区分 本地/测试/生产, 通过 env 环境读取不同文件配置 env.config
 * 通过 env.config 覆盖 default.config 加载到 app.config
 *
 * 目录下对应的 config 配置
 * 默认配置 config/default.config.js
 * 本地配置 config/local.config.js
 * 测试配置 config/beta.config.js
 * 生产配置 config/prod.config.js
 */
module.exports = (app) => {
  // 找到 config/ 目录
  const configPath = path.join(app.baseDir, 'config')
  // 获取 default.config
  let defaultConfig = {}
  try {
    defaultConfig = require(path.join(configPath, 'default.config.js'))
  } catch {
    console.log(`[config loader error] config/default.config.js not found`)
  }

  // 获取 env.config
  let envConfig = {}
  try {
    if (app.env.isLocal()) {
      envConfig = require(path.join(configPath, 'local.config.js'))
    } else if (app.env.isBeta()) {
      envConfig = require(path.join(configPath, 'beta.config.js'))
    } else if (app.env.isProduction()) {
      envConfig = require(path.join(configPath, 'prod.config.js'))
    }
  } catch {
    console.log(
      `[config loader error] config/${app.env.get()}.config.js not found`
    )
  }

  // 覆盖并加载 config 配置
  //   app.config = { ...defaultConfig, ...envConfig } // es6 语法
  app.config = Object.assign({}, defaultConfig, envConfig)
}
