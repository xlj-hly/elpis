const path = require('path')

module.exports = (app) => {
  // 配置静态根目录
  const koaStatic = require('koa-static')
  app.use(koaStatic(path.join(process.cwd(), './app/public')))

  // 模板渲染引擎
  const koaNunjucks = require('koa-nunjucks-2')
  app.use(
    koaNunjucks({
      // ext: 'tpl',
      ext: 'html',
      path: path.join(process.cwd(), 'app/public'),
      nunjucksConfig: {
        noCache: true,
        trimBlocks: true,
      },
    })
  )

  // ctx.body 解析中间件
  const bodyParser = require('koa-bodyparser')
  app.use(
    bodyParser({
      formLimit: '1000mb',
      enableTypes: ['json', 'form', 'text'],
    })
  )

  // 错误处理中间件
  app.use(app.middlewares.errorHandler)

  // API 签名合法性校验中间件
  app.use(app.middlewares.apiSignVerify)

  // API 参数验证中间件
  app.use(app.middlewares.apiParamsVerify)
}
