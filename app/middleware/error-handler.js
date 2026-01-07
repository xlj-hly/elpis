const util = require('util')

/**
 * error handler middleware
 * @param {Object} app - Koa 实例
 *
 * 兜底捕获所有错误
 *
 * @example
 * app.use(errorHandlerMiddleware)
 */
module.exports = (app) => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      // 异常处理
      const { status, message, detail } = e
      app.logger.error(
        `[--- Exception ---]: status: ${status} message: ${message} detail: ${JSON.stringify(detail)}`
      )
      // stack 属性不可枚举, 使用 util.inspect 完整打印错误对象 (包括不可枚举的 stack 等)
      app.logger.error(
        '[--- Exception Full ---]:\n',
        util.inspect(e, { depth: null })
      )

      if (message && message.includes('template not found')) {
        // 页面重定向
        ctx.status = 302 // 临时重定向
        ctx.redirect(`${app?.options?.homePage ?? '/'}`)
        return
      }

      ctx.status = 200
      ctx.body = {
        success: false,
        code: 50000,
        message: '异常, 请稍后重试',
      }
    }
  }
}
