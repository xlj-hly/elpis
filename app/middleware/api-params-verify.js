const Ajv2020 = require('ajv/dist/2020')
const ajv = new Ajv2020()

/**
 * api params verify middleware
 * @param {Object} app - Koa 实例
 *
 * API 参数验证
 *
 * @example
 * app.use(app.middlewares.apiParamsVerify)
 */
module.exports = (app) => {
  return async (ctx, next) => {
    if (!ctx.path.startsWith('/api/')) {
      return await next()
    }

    // 获取请求参数
    const { query, body, headers } = ctx.request
    const { params, path, method } = ctx

    app.logger.info(`[${method} ${path}] body: ${JSON.stringify(body)}`)
    app.logger.info(`[${method} ${path}] query: ${JSON.stringify(query)}`)
    app.logger.info(`[${method} ${path}] headers: ${JSON.stringify(headers)}`)
    app.logger.info(`[${method} ${path}] params: ${JSON.stringify(params)}`)

    const schema = app.routerSchema[path]?.[method.toLowerCase()]

    if (!schema) {
      return await next()
    }

    // 验证参数
    const validations = [
      { data: headers, schema: schema.headers },
      { data: query, schema: schema.query },
      { data: body, schema: schema.body },
      { data: params, schema: schema.params },
    ]

    // ajv 校验器
    let validate
    let valid = true

    // 遍历验证参数
    for (const { data, schema: schemaPart } of validations) {
      // 如果参数不存在或 schema 不存在, 则跳过
      if (!valid || !data || !schemaPart) continue
      // 编译 schema
      validate = ajv.compile(schemaPart)
      // 验证参数
      valid = validate(data)
      // 如果验证失败, 则跳出循环
      if (!valid) break
    }

    if (!valid) {
      ctx.status = 200
      ctx.body = {
        success: false,
        code: 442,
        message: `request validate fail: ${ajv.errorsText(validate.errors)}`,
      }
      return
    }

    await next()
  }
}
