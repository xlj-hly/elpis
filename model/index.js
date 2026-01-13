const glob = require('glob')
const path = require('path')
const _ = require('lodash')

/**
 * 项目继承 model 配置
 * @param {object} model - model 配置
 * @param {object} project - project 配置
 * @returns {object} - 继承后的配置
 */
const projectExtendModel = (model, project) => {
  return _.mergeWith({}, model, project, (modelValue, projValue) => {
    if (Array.isArray(modelValue) && Array.isArray(projValue)) {
      let result = []

      // 因为 project 继承 model, 需要处理修改和新增
      // project 有, model 没有 => 新增
      // project 没有, model 有 => 保留 (继承)
      // project 有, model 有 => 修改 (重载)

      // 修改和保留
      for (let i = 0; i < modelValue.length; ++i) {
        let modelItem = modelValue[i]
        const projItem = projValue.find((item) => item.key === modelItem.key)
        // project 有, model 有, 递归调用 projectExtendModel 方法覆盖修改
        result.push(
          projItem ? projectExtendModel(modelItem, projItem) : modelItem
        )
      }

      // 新增
      for (let i = 0; i < projValue.length; ++i) {
        const projItem = projValue[i]
        const modelItem = modelValue.find((item) => item.key === projItem.key)
        if (!modelItem) {
          result.push(projItem)
        }
      }

      return result
    }
  })
}

/**
 * 解析 model 配置, 返回完整结构
 * 
 * @param {import('../elpis-core').ElpisApp} app - Koa 实例
 * @returns {Object} - 完整结构
 * 
 * @example

[{
    model: ${model},
    project: {
        projKey1: ${proj1},
        projKey2: ${proj2},
        ...
    },
}, ...]

 */
module.exports = (app) => {
  /** @type {any[]} */
  const modelList = []

  // 遍历当前文件夹, 构造模型数据, 挂载到 modelList
  const modelPath = path.join(app.baseDir, 'model')
  const fileList = glob.sync('**/*.js', {
    cwd: modelPath,
    absolute: true,
  })

  fileList.forEach((file) => {
    if (file.includes('index.js')) return

    // 区分配置类型 (model | project)
    const type = file.includes(path.sep + 'project' + path.sep)
      ? 'project'
      : 'model'

    // 获取相对于 model 目录的路径
    const relativePath = path.relative(modelPath, file)
    const pathParts = relativePath.split(path.sep) // [ business, project, pdd.js ]

    if (type === 'project') {
      const modelKey = pathParts[0]
      const projKey = pathParts[2].replace('.js', '')
      let modelItem = modelList.find((item) => item.model?.key === modelKey)
      // 初始化 model 数据结构
      if (!modelItem) {
        modelItem = {}
        modelList.push(modelItem)
      }
      if (!modelItem.project) {
        // 初始化 project 数据结构
        modelItem.project = {}
      }
      modelItem.project[projKey] = require(file)
      modelItem.project[projKey].key = projKey // 注入 projKey
    }
    if (type === 'model') {
      const modelKey = pathParts[0]
      let modelItem = modelList.find((item) => item.model?.key === modelKey)
      // 初始化 model 数据结构
      if (!modelItem) {
        modelItem = {}
        modelList.push(modelItem)
      }
      modelItem.model = require(file)
      modelItem.model.key = modelKey // 注入 modelKey
    }
  })

  // 数据进一步处理: project => 继承 model
  modelList.forEach((item) => {
    const { model, project } = item
    for (const projKey in project) {
      project[projKey] = projectExtendModel(model, project[projKey])
    }
  })

  return modelList
}
