/**
 * @param {import('../../elpis-core').ElpisApp} app
 */
module.exports = (app) => {
  const BaseController = require('./base')(app)
  return class ProjectController extends BaseController {
    /**
     * 根据 proj_key 获取 project 信息
     * @param {Object} ctx - 上下文
     * @returns {Promise<any>}
     */
    getProject(ctx) {
      const { proj_key } = ctx.request.query
      const { project: ProjectService } = app.service
      const project = ProjectService.getProject(proj_key)
      if (!project) {
        this.fail(ctx, '获取 project 信息失败', 50000)
        return
      }
      this.success(ctx, project)
    }
    /**
     * 获取 projectKey 项目列表 | 全量获取
     * @param {Object} ctx - 上下文
     * @returns {Promise<any>}
     */
    async getProjectList(ctx) {
      const { proj_key } = ctx.request.query
      const { project: ProjectService } = app.service
      const projectList = await ProjectService.getProjectList(proj_key)

      // 构造返回结果
      const dtoProjectList = projectList.map((item) => {
        const { modelKey, key, name, desc, homePage } = item
        return { modelKey, key, name, desc, homePage }
      })

      this.success(ctx, dtoProjectList)
    }
    /**
     * 获取所有模型和项目结构化数据
     * @param {Object} ctx - 上下文
     * @returns {Promise<any>}
     */
    getModelList(ctx) {
      const { project: ProjectService } = app.service
      const modelList = ProjectService.getModelList()

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
