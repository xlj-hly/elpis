const crypto = require('crypto')
/**
 * api sign verify middleware
 * @param {Object} app - Koa 实例
 *
 * API 签名合法性校验
 *
 * @example
 * app.use(app.middlewares.apiSignVerify)
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对 API 请求校验
    if (!ctx.path.startsWith('/api/')) {
      return await next()
    }

    const validTime = 1000 * 60 * 5 // 5分钟内有效
    const signKey = '#^%@#*#*#*##*&@$$##**&' // 签名密钥

    const { path, method } = ctx
    const { headers } = ctx.request
    const { s_sign: sSign, s_t: st } = headers

    const signature = crypto
      .createHmac('sha256', signKey)
      .update(signKey + st)
      .digest('hex')

    app.logger.info(`[${method} ${path}] signature: ${signature}`)

    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > validTime
    ) {
      ctx.status = 200
      ctx.body = {
        success: false,
        code: 445,
        message: 'sign not valid',
      }
      return
    }

    await next()
  }
}
