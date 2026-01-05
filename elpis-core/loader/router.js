const KoaRouter = require('koa-router')
const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * router loader
 * @param {Object} app - Koa 实例
 *
 * 解析所有 app/router/**.js, 加载到 KoaRouter 实例中
 */
module.exports = (app) => {
  // 找到路由文件路径
  const routerPath = path.resolve(app.businessPath, `.${sep}router`)

  // 实例化 KoaRouter
  const router = new KoaRouter()

  // 注册所有路由
  const fileList = glob.sync(path.resolve(routerPath, `.${sep}**${sep}**.js`))
  fileList.forEach((file) => {
    // module.exports = (app, router) => {
    //   router.get('xxx/xxx', xxxController.xxx)
    // }
    require(path.resolve(file))(app, router)
  })

  // 404 路由
  router.all(/.*/, async (ctx) => {
    ctx.status = 302 // 临时重定向
    ctx.redirect(`${app?.options?.homePage ?? '/'}`)
  })

  // 挂载 KoaRouter 实例到 app 对象上
  app.use(router.routes())
  app.use(router.allowedMethods())
}
