// @ts-nocheck
const assert = require('assert')
const crypto = require('crypto')
const supertest = require('supertest')
const elpisCore = require('../../elpis-core')

const signKey = '#^%@#*#*#*##*&@$$##**&'
const st = Date.now()
const signature = crypto
  .createHmac('sha256', signKey)
  .update(signKey + st)
  .digest('hex')

describe('测试 project 接口', function () {
  this.timeout(60000)

  let request

  it('启动服务', async () => {
    const app = elpisCore.start({ name: 'Test' })
    request = supertest(app.listen())
  })

  it('GET /api/project/model_list', async () => {
    let temRequest = request.get('/api/project/model_list')
    temRequest = temRequest.set('s_t', st)
    temRequest = temRequest.set('s_sign', signature)
    const res = await temRequest
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
