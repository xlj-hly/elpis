const glob = require('glob')
const path = require('path')

/**
 * router-schema loader
 * @param {Object} app - Koa 实例
 * 
 * 通过 'json-schema & ajv' 对 API 规则进行约束，配合 api-params-verify 中间件使用
 * 
 * app/router-schema/**.js
 
   输出：  
   app.routerSchema = {
      '${api1}': ${jsonSchema},
      '${api2}': ${jsonSchema},
      ...
   }

*/
module.exports = (app) => {
  // 读取 app/router-schema/**/**.js 下的所有文件
  const routerSchemaPath = path.join(app.businessPath, 'router-schema')
  const fileList = glob.sync('**/*.js', {
    cwd: routerSchemaPath,
    absolute: true,
  })

  // 注册所有 routerSchema, 使得可以 'app.routerSchema' 的方式访问
  let routerSchema = {}

  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(file),
    }
  })
  app.routerSchema = routerSchema
}
