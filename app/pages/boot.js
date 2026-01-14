import { createApp } from 'vue'
import './assets/custom.css'

// 引入 element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 引入 pinia
import pinia from '@store/index'

// 引入 router
import { createRouter, createWebHashHistory } from 'vue-router'

/**
 * vue 应用启动器
 *
 * @param pageComponent {any} - 页面组件
 * @param [options] {object} - 配置选项（可选）
 * @param [options.routers] {Array<any>} - 路由配置列表
 * @param [options.libs] {Array<any>} - 第三方库配置
 */

export default (pageComponent, { routers = [], libs = [] } = {}) => {
  const app = createApp(pageComponent)
  app.use(ElementPlus)
  app.use(pinia)
  // 引入第三方库
  if (libs?.length > 0) {
    for (let i = 0, len = libs.length; i < len; i++) {
      app.use(libs[i])
    }
  }

  // 引入路由
  if (routers?.length > 0) {
    const router = createRouter({
      history: createWebHashHistory(), // 使用 hash 模式
      routes: routers,
    })
    app.use(router)
    router.isReady().then(() => {
      app.mount('#root')
    })
  } else {
    app.mount('#root')
  }
}
