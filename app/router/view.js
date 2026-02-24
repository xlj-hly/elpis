/**
 * @param {import('../../elpis-core').ElpisApp} app
 * @param {import('koa-router')} router
 */
module.exports = (app, router) => {
  const { view: ViewController } = app.controller

  // router.get('/', () => {
  //   return null
  // })

  // 用户输入 http://ip:port/view/page1 会渲染 output/entry.page1.tpl 文件
  router.get('/view/:page', ViewController.renderPage.bind(ViewController))
}
