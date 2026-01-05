const glob = require('glob')
const path = require('path')
const { sep } = path

/**
 * middleware loader
 * @param {Object} app - Koa 实例
 * 
 * 加载所有 middleware
 * 
 * @example
    app/middleware/
    └── custom-module/
        └── custom-middleware.js

=>  app.middleware.customModule.customMiddleware
*
*/
module.exports = (app) => {
  // 读取 app/middleware/**/**.js 下的所有文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`)
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`)
  )

  // 遍历所有文件目录，并加载到 app.middleware
  const middlewares = {}
  fileList.forEach((file) => {
    // 提取文件名
    let name = path.resolve(file)

    // 截取路径 app/middleware/custom-module/custom-middleware => custom-module/custom-middleware
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf(`.`)
    )

    // 把 '-' 改为驼峰 custom-module/custom-middleware => CustomModule.CustomMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 middleware 到内存app对象上
    let tempMiddleware = middlewares
    const names = name.split(sep)
    for (let i = 0, len = names.length; i < len; ++i) {
      // 文件
      if (i === len - 1) {
        tempMiddleware[names[i]] = require(path.resolve(file))(app)
      }
      // 目录
      else {
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {}
        }
        tempMiddleware = tempMiddleware[names[i]]
      }
    }
  })

  app.middlewares = middlewares
}
