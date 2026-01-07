const superagent = require('superagent')

module.exports = (app) => {
  /**
   * Service 基类
   * @param {Object} app - Koa 实例
   *
   */
  return class BaseService {
    constructor() {
      this.app = app
      this.config = app.config
      this.curl = superagent
    }
  }
}
