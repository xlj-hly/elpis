/**
 * @param {import('../../elpis-core').ElpisApp} app
 */
module.exports = (app) => {
  const BaseService = require('./base')(app)
  const modelList = require('../../model/index')(app)

  /**
   * 获取所有模型和项目结构化数据
   * @returns {Promise<any[]>}
   */
  return class ProjectService extends BaseService {
    async getModelList() {
      return modelList
    }
  }
}
