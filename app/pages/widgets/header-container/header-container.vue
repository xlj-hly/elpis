<template>
  <el-container class="header-container">
    <el-header class="header">
      <el-row type="flex" align="middle" class="header-row">
        <!-- 左上角区域 -->
        <el-row type="flex" align="middle" class="title-panel">
          <div class="logo">
            <SvgLogo />
          </div>
          <el-row class="title-text">{{ title }}</el-row>
        </el-row>
        <!-- 菜单区域 -->
        <el-row>
          <slot name="menu-content"></slot>
        </el-row>
        <!-- 右上角区域 -->
        <el-row type="flex" align="middle" justify="end" class="setting-panel">
          <slot name="setting-content"></slot>
          <div class="avatar">
            <img
              :src="avatar"
              alt="头像"
              class="avatar"
              @error="handleImageError"
            />
          </div>
          <el-dropdown @command="handleUserCommand">
            <span class="user-name">
              {{ userName }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-item class="logout" command="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <!-- 主体区域 -->
    <el-main class="main">
      <slot name="main"></slot>
    </el-main>
  </el-container>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})

import SvgLogo from './svg-logo.vue'
import { ref } from 'vue'
import defaultAvatar from './assets/avatar.png'

const userName = ref('admin')
const avatar = ref('https://s1.img-e.com/20260115/69685e2755eec.png')

const handleUserCommand = (e) => {
  console.log(e)
}

const handleImageError = () => (avatar.value = defaultAvatar)
</script>

<style lang="less" scoped>
.header-container {
  height: 100%;
  min-width: 1000px;
  overflow: hidden;

  .header {
    max-height: 120px;
    border-bottom: 1px solid var(--el-text-color-primary);

    .header-row {
      height: 60px;
      padding: 0 20px;

      .title-panel {
        width: 180px;
        min-width: 180px;

        .logo {
          margin-right: 10px;
          width: 25px;
          height: 25px;
          :deep(path) {
            fill: var(--el-text-color-primary);
          }
        }

        .title-text {
          font-size: 15px;
          font-weight: 600;
        }
      }

      .setting-panel {
        margin-left: auto;
        margin-right: 10px;
        min-width: 180px;

        .avatar {
          margin-right: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .user-name {
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          height: 60px;
          line-height: 60px;
          outline: none;
        }
      }
    }
  }
}

:deep(.el-header) {
  padding: 0;
}
</style>
