<template>
  <div>
    <HeaderContainer :title="projName">
      <template #menu-content>
        <!-- 根据 menuStore.menuList 渲染-->
        <el-menu
          :default-active="activeKey"
          :ellipsis="false"
          mode="horizontal"
          @select="onMenuSelect"
        >
          <template v-for="item in menuStore.menuList" :key="item.key">
            <SubMenu
              v-if="item.subMenu && item.subMenu.length > 0"
              :menu-item="item"
            />
            <el-menu-item v-else :index="item.key">
              {{ item.name }}
            </el-menu-item>
          </template>
        </el-menu>
      </template>
      <template #setting-content>
        <!-- 根据 projectStore.projectList 渲染-->
        <el-dropdown @command="handleProjectCommand">
          <span class="project-list">
            {{ projName }}
            <el-icon
              v-if="projectStore.projectList.length > 1"
              class="el-icon--right"
            >
              <ArrowDown />
            </el-icon>
          </span>
          <template v-if="projectStore.projectList.length > 1" #dropdown>
            <el-dropdown-item
              v-for="item in projectStore.projectList"
              :key="item.key"
              :command="item.key"
              :disabled="item.name === projName"
            >
              {{ item.name }}
            </el-dropdown-item>
          </template>
        </el-dropdown>
      </template>
      <template #main>
        <slot name="main"></slot>
      </template>
    </HeaderContainer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import HeaderContainer from '@widgets/header-container/header-container.vue'
import SubMenu from './complex-view/sub-menu/index.vue'
import { useMenuStore, useProjectStore } from '@store/index'
import { ArrowDown } from '@element-plus/icons-vue'

defineProps({
  projName: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['menu-select'])

const route = useRoute()
const menuStore = useMenuStore()
const projectStore = useProjectStore()
const activeKey = ref('')

onMounted(() => {})

watch(
  () => route.query.key,
  () => {
    setActiveKey()
  }
)

watch(
  () => menuStore.menuList,
  () => {
    setActiveKey()
  }
)

const setActiveKey = () => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: route.query.key,
  })
  activeKey.value = menuItem?.key
}

const onMenuSelect = (menuKey) => {
  const menuItem = menuStore.findMenuItem({
    key: 'key',
    value: menuKey,
  })
  emit('menu-select', menuItem)
}

const handleProjectCommand = (event) => {
  const projectItem = projectStore.projectList.find(
    (item) => item.key === event
  )
  if (!projectItem || !projectItem.homePage) return

  const { origin, pathname } = window.location
  window.location.replace(`${origin}${pathname}#${projectItem.homePage}`)
  window.location.reload()
}
</script>

<style lang="less" scoped>
:deep(.el-menu--horizontal.el-menu) {
  border-bottom: 1px solid var(--el-text-color-primary);
}
.project-list {
  margin-right: 20px;
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
  outline: none;
}
</style>
