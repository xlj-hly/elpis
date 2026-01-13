/**
 * @param {import('../../elpis-core').ElpisApp} app
 */
module.exports = (app) => {
  const BaseController = require('./base')(app)
  return class ProjectController extends BaseController {
    /**
     * 获取所有模型和项目结构化数据
     * @param {Object} ctx - 上下文
     * @returns {Promise<any>}
     */
    async getModelList(ctx) {
      const { project: ProjectService } = app.service
      const modelList = await ProjectService.getModelList()

      // 构造返回结果, 只返回关键数据
      // @ts-ignore
      const dtoModelList = modelList.reduce((preList, item) => {
        const { model, project } = item

        // 构造 model 数据结构
        const { key, name, desc } = model
        const dtoModel = { key, name, desc }

        // 构造 project 数据结构
        const dtoProject = Object.keys(project).reduce((preObj, projKey) => {
          const { key, name, desc, homePage } = project[projKey]
          // @ts-ignore
          preObj[projKey] = { key, name, desc, homePage }
          return preObj
        }, {})

        preList.push({ model: dtoModel, project: dtoProject })
        return preList
      }, [])
      this.success(ctx, dtoModelList)
    }
  }
}
