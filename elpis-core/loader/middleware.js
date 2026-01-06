const glob = require('glob')
const path = require('path')

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
  const middlewarePath = path.join(app.businessPath, 'middleware')
  const fileList = glob.sync('**/*.js', {
    cwd: middlewarePath,
    absolute: true,
  })

  // 遍历所有文件目录，并加载到 app.middleware
  const middlewares = {}
  fileList.forEach((file) => {
    // 提取相对路径（不含扩展名）
    let name = path.relative(middlewarePath, file).replace(/\.js$/, '')

    // 把 '-' 改为驼峰 custom-module/custom-middleware => CustomModule.CustomMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 挂载 middleware 到内存app对象上
    let tempMiddleware = middlewares
    const names = name.split(path.sep)
    for (let i = 0, len = names.length; i < len; ++i) {
      // 文件
      if (i === len - 1) {
        tempMiddleware[names[i]] = require(file)(app)
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
