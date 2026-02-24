import boot from '@pages/boot'
import dashboard from './index'

const router = []

// 头部菜单 路由
router.push({
  path: '/iframe',
  component: () => import('./complex-view/iframe-view/index.vue'),
})
router.push({
  path: '/schema',
  component: () => import('./complex-view/schema-view/index.vue'),
})
// custom 自定义路由
router.push({
  path: '/todo',
  component: () => import('./todo/index.vue'),
})

// 侧边栏 路由
router.push({
  path: '/sider',
  component: () => import('./complex-view/sider-view/index.vue'),
  children: [
    {
      path: 'iframe',
      component: () => import('./complex-view/iframe-view/index.vue'),
    },
    {
      path: 'schema',
      component: () => import('./complex-view/schema-view/index.vue'),
    },
    {
      path: 'todo',
      component: () => import('./todo/index.vue'),
    },
  ],
})

// 侧边栏兜底
router.push({
  path: '/sider/:chapters+',
  component: () => import('./complex-view/sider-view/index.vue'),
})

boot(dashboard, {
  routers: router,
})
