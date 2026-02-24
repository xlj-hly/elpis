// @ts-nocheck
const crypto = require('crypto')
const supertest = require('supertest')
const Test = require('supertest/lib/test')
const elpisCore = require('../elpis-core')

const SIGN_KEY = '#^%@#*#*#*##*&@$$##**&'

function generateSignature() {
  const st = Date.now()
  const signature = crypto
    .createHmac('sha256', SIGN_KEY)
    .update(SIGN_KEY + st)
    .digest('hex')
  return { st, signature }
}

// 扩展 supertest，添加 sign 方法注入签名
Test.prototype.sign = function () {
  const { st, signature } = generateSignature()
  return this.set('s_t', st).set('s_sign', signature)
}

// 启动服务
before(async function () {
  this.timeout(60000)
  const app = elpisCore.start({ name: 'Test' })

  global.testApp = app
  global.request = supertest(app.callback())
})

// 关闭服务
after(async function () {
  if (global.testApp && global.testApp.server) {
    await new Promise((resolve) => {
      global.testApp.server.close(() => {
        console.log('Test server closed')
        resolve()
      })
    })
  }
})
