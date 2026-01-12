module.exports = (app) => {
  const BaseService = require('./base')(app)
  return class ProjectService extends BaseService {
    async getList() {
      return [
        {
          id: 1,
          name: 'Project 1',
          description: 'Description 1',
        },
        {
          id: 2,
          name: 'Project 2',
          description: 'Description 2',
        },
        {
          id: 3,
          name: 'Project 3',
          description: 'Description 3',
        },
      ]
    }
  }
}
