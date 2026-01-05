const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * service loader
 * @param {Object} app - Koa 实例
 * 
 * 加载所有 service, 可以通过 'app.service.${目录}.${文件}' 访问
 * 
 * @example
    app/service/
    └── custom-module/
        └── custom-service.js

=>  app.service.customModule.customService
*
*/
module.exports = (app) => {
  // 读取 app/service/**/**.js 下的所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`)
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`))

  // 遍历所有文件目录，并加载到 app.service
  const service = {}
  fileList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)

    // 截取路径 app/service/custom-module/custom-service => custom-module/custom-service
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(`.`)
    )

    // 把 '-' 改为驼峰 custom-module/custom-service => CustomModule.CustomService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 service 到内存app对象上
    let tempService = service
    const names = name.split(sep) // [ customModule(目录), customService(文件) ]
    for (let i = 0, len = names.length; i < len; ++i) {
      // 文件
      if (i === len - 1) {
        const ServiceModule = require(path.resolve(file))(app)
        tempService[names[i]] = new ServiceModule()
      }
      // 目录
      else {
        if (!tempService[names[i]]) {
          tempService[names[i]] = {}
        }
        tempService = tempService[names[i]]
      }
    }
  })

  app.service = service
}
