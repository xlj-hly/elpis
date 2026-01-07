module.exports = (app) => {
  const BaseController = require('./base')(app)
  return class ProjectController extends BaseController {
    /**
     * 获取项目列表
     * @param {Object} ctx - 上下文
     */
    async getProjectList(ctx) {
      const { proj_key: projKey } = ctx.query
      console.log('projKey', projKey)

      const { project: ProjectService } = app.service
      const projectList = await ProjectService.getList()
      this.success(ctx, projectList)
    }
  }
}
