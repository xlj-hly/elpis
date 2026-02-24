/**
 * @param {import('../../elpis-core').ElpisApp} app
 */
module.exports = (app) => {
  const BaseService = require('./base')(app)
  const modelList = require('../../model/index')(app)

  return class ProjectService extends BaseService {
    /**
     * 根据 proj_key 获取 project 信息
     * @param {string} proj_key - projectKey
     * @returns {any}
     */
    getProject(projKey) {
      for (const item of modelList) {
        if (item.project[projKey]) {
          return item.project[projKey]
        }
      }
      return null
    }
    /**
     * 获取 projectKey 项目列表 | 全量获取
     * @param {string} proj_key - projectKey
     * @returns {Promise<any[]>}
     */
    async getProjectList(proj_key) {
      const projectList = []

      modelList.forEach((item) => {
        // item:
        // {
        //   model: {}
        //   project: {
        //     [projKey]: {}
        //   }
        // }
        const { project } = item

        // 如果传 proj_key 且 project 中没有该 proj_key, 则跳过
        if (proj_key && !project[proj_key]) {
          return
        }

        for (const pKey in project) {
          projectList.push(project[pKey])
        }
      })

      return projectList
    }

    /**
     * 获取所有模型和项目结构化数据
     * @returns {Promise<any[]>}
     */
    getModelList() {
      return modelList
    }
  }
}
