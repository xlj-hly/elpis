require('dotenv').config()

const Koa = require('koa')
const path = require('path')
const { sep } = path // 兼容系统斜杠

// 环境变量
const env = require('./env')

const middlewareLoader = require('./loader/middleware')
const routerSchemaLoader = require('./loader/router-schema')
const controllerLoader = require('./loader/controller')
const serviceLoader = require('./loader/service')
const configLoader = require('./loader/config')
const extendLoader = require('./loader/extend')
const routerLoader = require('./loader/router')

module.exports = {
  /**
   * 启动服务
   * @param {Object} options - 项目配置
   * @param {string} options.name - 项目名称
   * @param {string} options.homePage - 首页路径
   */
  start(options = {}) {
    // Koa 实例
    const app = new Koa()

    // 应用配置
    app.options = options

    // 基础路径
    app.baseDir = process.cwd()

    // 业务文件路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`)

    // 初始化环境配置
    app.env = env()
    console.log(`[${app.options.name}] environment: ${app.env.get()}`)

    // 加载middleware
    middlewareLoader(app)
    console.log(`[${app.options.name}] load middleware done`)

    // 加载router-schema
    routerSchemaLoader(app)
    console.log(`[${app.options.name}] load router-schema done`)

    // 加载controller
    controllerLoader(app)
    console.log(`[${app.options.name}] load controller done`)

    // 加载service
    serviceLoader(app)
    console.log(`[${app.options.name}] load service done`)

    // 加载config
    configLoader(app)
    console.log(`[${app.options.name}] load config done`)

    // 加载extend
    extendLoader(app)
    console.log(`[${app.options.name}] load extend done`)

    // 注册全局中间件
    try {
      require(`${app.businessPath}.${sep}middleware.js`)(app)
      console.log(`[${app.options.name}] load global middleware done`)
    } catch {
      console.log('[global middleware error] middleware.js not found')
    }

    // 加载router
    routerLoader(app)
    console.log(`[${app.options.name}] load router done`)

    // 启动服务
    try {
      const port = process.env.PORT || 8080
      const host = process.env.HOST || '0.0.0.0'
      app.listen(port, host)
      console.log(`Server is running on http://${host}:${port}`)
    } catch (e) {
      console.log('Server startup failed:', e)
      process.exit(1)
    }
  },
}
