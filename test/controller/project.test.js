// @ts-nocheck
const assert = require('assert')
require('../index.test')

describe('测试 project 接口', function () {
  this.timeout(60000)

  let modelList
  let projectList = []

  before(async function () {
    modelList = require('../../model/index')(global.testApp)
    modelList.forEach((item) => {
      const { project } = item
      for (const pKey in project) {
        projectList.push(project[pKey])
      }
    })
  })

  it('GET /api/project without proj_key', async () => {
    const res = await global.request.get('/api/project').sign()
    assert(res.body.success === false)
    const resData = res.body
    assert(resData.code === 442)
    // includes 方法的返回值是布尔值。 resData.message 包含 'request validate fail'
    assert(
      resData.message.includes(
        "request validate fail: data must have required property 'proj_key'"
      )
    )
  })

  it('GET /api/project fail', async () => {
    const res = await global.request.get('/api/project').sign().query({
      proj_key: 'xxxxxx',
    })
    assert(res.body.success === false)
    const resData = res.body
    assert(resData.code === 50000)
    assert(resData.message === '获取 project 信息失败')
  })

  it('GET /api/project with proj_key', async () => {
    for (let i = 0; i < projectList.length; ++i) {
      const projItem = projectList[i]
      const { key: projKey } = projItem
      console.log(
        `-------------- GET /api/project with proj_key - projKey: ${projKey}`
      )
      const res = await global.request.get('/api/project').sign().query({
        proj_key: projKey,
      })
      assert(res.body.success === true)

      const resData = res.body.data

      assert(resData.key === projKey)
      assert(resData.modelKey)
      assert(resData.name)
      assert(resData.desc !== undefined)
      assert(resData.homePage !== undefined)

      const { menu } = resData
      menu.forEach((item) => {
        checkMenuItem(item)
      })
    }

    // 校验 menu 菜单
    function checkMenuItem(item) {
      console.log(
        `-------------- GET /api/project with proj_key - menuKey: ${item.key}`
      )
      assert(item.key)
      assert(item.name)
      assert(item.menuType)

      if (item.menuType === 'group') {
        assert(item.subMenu !== undefined)
        item.subMenu.forEach((subItem) => {
          checkMenuItem(subItem)
        })
      }
      if (item.menuType === 'module') {
        checkModule(item)
      }
    }

    // 检查 module 菜单配置
    function checkModule(item) {
      const { moduleType } = item
      assert(moduleType)
      if (moduleType === 'sider') {
        const { siderConfig } = item
        assert(siderConfig)
        assert(siderConfig.menu)
        siderConfig.menu.forEach((subItem) => {
          checkMenuItem(subItem)
        })
      }
      if (moduleType === 'iframe') {
        const { iframeConfig } = item
        assert(iframeConfig)
        assert(iframeConfig.path !== undefined)
      }
      if (moduleType === 'custom') {
        const { customConfig } = item
        assert(customConfig)
        assert(customConfig.path !== undefined)
      }
      if (moduleType === 'schema') {
        const { schemaConfig } = item
        assert(schemaConfig)
        assert(schemaConfig.api !== undefined)
        assert(schemaConfig.schema)
      }
    }
  })

  it('GET /api/project/list without proj_key', async () => {
    const res = await global.request.get('/api/project/list').sign()
    assert(res.body.success === true)

    const resData = res.body.data

    assert(resData.length === projectList.length)
    for (let i = 0; i < resData.length; ++i) {
      // modelKey, key, name, desc, homePage
      const { modelKey, key, name, desc, homePage } = resData[i]
      assert(modelKey)
      assert(key)
      assert(name)
      assert(desc !== undefined)
      assert(homePage !== undefined)
    }
  })

  it('GET /api/project/list with proj_key', async () => {
    const proKey =
      projectList[Math.floor(Math.random() * projectList.length)].key
    const { modelKey } = projectList.find((item) => item.key === proKey)

    const res = await global.request.get('/api/project/list').sign().query({
      proj_key: proKey,
    })
    assert(res.body.success === true)

    const resData = res.body.data
    assert(
      projectList.filter((item) => item.modelKey === modelKey).length ===
        resData.length
    )
    for (let i = 0; i < resData.length; ++i) {
      const { modelKey, key, name, desc, homePage } = resData[i]
      assert(modelKey)
      assert(key)
      assert(name)
      assert(desc !== undefined)
      assert(homePage !== undefined)
    }
  })

  it('GET /api/project/model_list', async () => {
    const res = await global.request.get('/api/project/model_list').sign()
    assert(res.body.success === true)

    const resData = res.body.data
    assert(resData.length > 0)

    for (const item of resData) {
      assert(item.model)
      assert(item.model.key)
      assert(item.model.name)
      assert(item.project)
      for (const project of Object.values(item.project)) {
        assert(project.key)
        assert(project.name)
      }
    }
  })
})
