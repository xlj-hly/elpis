<template>
  <div>
    <HeaderView :proj-name="projName" @menu-select="onMenuSelect">
      <template #main>
        <router-view />
      </template>
    </HeaderView>
  </div>
</template>

<script setup>
import HeaderView from './complex-view/header-view/index'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import $curl from '@common/curl'
import { useProjectStore, useMenuStore } from '@store/index'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const projectStore = useProjectStore()
const projName = ref('')

onMounted(() => {
  getProjectList()
  getProject()
})

// 请求 /api/project/list 接口, 并缓存到 project-store
const getProjectList = async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project/list',
    query: {
      proj_key: route.query.proj_key,
    },
  })

  if (!res || !res.success || !res.data) {
    return
  }

  projectStore.setProjectList(res.data)
}

// 请求 /api/project 接口, 并缓存到 menu-store
const getProject = async () => {
  const res = await $curl({
    method: 'get',
    url: '/api/project',
    query: {
      proj_key: route.query.proj_key,
    },
  })

  if (!res || !res.success || !res.data) {
    return
  }

  const { name, menu } = res.data
  projName.value = name

  menuStore.setMenuList(menu)
}

// 点击头部菜单回调
const onMenuSelect = (menuItem) => {
  const { moduleType, key, customConfig } = menuItem

  // 如果是当前页面, 不处理
  if (key === route.query.key) return

  const pathMap = {
    sider: '/sider',
    iframe: '/iframe',
    schema: '/schema',
    custom: customConfig?.path,
  }

  router.push({
    path: pathMap[moduleType],
    query: {
      proj_key: route.query.proj_key,
      key,
    },
  })
}
</script>

<style lang="less" scoped></style>
