module.exports = (app) => {
  /**
   * Controller 基类
   * @param {Object} app - Koa 实例
   *
   */
  return class BaseController {
    constructor() {
      this.app = app
      this.config = app.config
    }

    /**
     * 成功响应
     * @param {Object} ctx - Koa 上下文
     * @param {Object} data - 数据
     * @param {Object} metadata - 元数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data,
        metadata,
      }
    }

    /**
     * 失败响应
     * @param {Object} ctx - Koa 上下文
     * @param {string} message - 错误信息
     * @param {number} code - 错误码
     */
    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      }
    }
  }
}
