const glob = require('glob')
const path = require('path')

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
  const controllerPath = path.join(app.businessPath, 'controller')
  const fileList = glob.sync('**/*.js', {
    cwd: controllerPath,
    absolute: true,
  })
  // 遍历所有文件目录，并加载到 app.controller
  const controller = {}
  fileList.forEach((file) => {
    // 提取相对路径（不含扩展名）
    let name = path.relative(controllerPath, file).replace(/\.js$/, '')

    // 把 '-' 改为驼峰 custom-module/custom-controller => CustomModule.CustomController
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 controller 到内存app对象上
    let tempController = controller
    const names = name.split(path.sep) // [ customModule(目录), customController(文件) ]
    for (let i = 0, len = names.length; i < len; ++i) {
      // 文件
      if (i === len - 1) {
        const ControllerModule = require(file)(app)
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
