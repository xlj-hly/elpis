const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * controller loader
 * @param {Object} app - Koa 实例
 * 
 * 加载所有 controller, 可以通过 'app.controller.${目录}.${文件}' 访问
 * 
 * @example
    app/controller/
    └── custom-module/
        └── custom-controller.js

=>  app.controller.customModule.customController
*
*/
module.exports = (app) => {
  // 读取 app/controller/**/**.js 下的所有文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`)
  const fileList = glob.sync(
    path.resolve(controllerPath, `.${sep}**${sep}**.js`)
  )

  // 遍历所有文件目录，并加载到 app.controller
  const controller = {}
  fileList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)

    // 截取路径 app/controller/custom-module/custom-controller => custom-module/custom-controller
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(`.`)
    )

    // 把 '-' 改为驼峰 custom-module/custom-controller => CustomModule.CustomController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 controller 到内存app对象上
    let tempController = controller
    const names = name.split(sep) // [ customModule(目录), customController(文件) ]
    for (let i = 0, len = names.length; i < len; ++i) {
      // 文件
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app)
        tempController[names[i]] = new ControllerModule()
      }
      // 目录
      else {
        if (!tempController[names[i]]) {
          tempController[names[i]] = {}
        }
        tempController = tempController[names[i]]
      }
    }
  })

  app.controller = controller
}
