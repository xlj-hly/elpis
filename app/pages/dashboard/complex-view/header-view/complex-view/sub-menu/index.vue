<template>
  <el-sub-menu :index="menuItem.key">
    <template #title>{{ menuItem.name }}</template>
    <template v-for="item in menuItem.subMenu" :key="item.key">
      <SubMenu
        v-if="item.subMenu && item.subMenu.length > 0"
        :menu-item="item"
      />
      <el-menu-item v-else :index="item.key">
        {{ item.name }}
      </el-menu-item>
    </template>
  </el-sub-menu>
</template>

<script setup>
import SubMenu from './index.vue'

defineProps({
  menuItem: {
    type: Object,
    default: () => {},
  },
})
</script>

<style lang="less" scoped></style>
