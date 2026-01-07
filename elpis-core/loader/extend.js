const glob = require('glob')
const path = require('path')

/**
 * extend loader
 * @param {Object} app - Koa 实例
 * 
 * 加载所有 extend, 可以通过 'app.extend.${文件}' 访问
 * 
 * @example
    app/extend/
    └── custom-extend.js

=>  app.extend.customExtend
*
*/
module.exports = (app) => {
  // 读取 app/extend/**.js 下的所有文件
  const extendPath = path.join(app.businessPath, 'extend')
  const fileList = glob.sync('**/*.js', {
    cwd: extendPath,
    absolute: true,
  })

  // 遍历所有文件目录，并加载到 app.extend
  fileList.forEach((file) => {
    // 提取文件名（不含扩展名）
    let name = path.parse(path.relative(extendPath, file)).name

    // 把 '-' 改为驼峰 custom-extend => CustomExtend
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase())

    // 过滤 app 已经存在的 key
    for (const key in app) {
      if (key === name) {
        console.log(`[extend loader error] ${name} already exists in app`)
        return
      }
    }

    // 挂载 extend 到内存app对象上
    app[name] = require(file)(app)
  })
}
