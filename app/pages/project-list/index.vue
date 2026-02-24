<template>
  <HeaderContainer title="项目列表">
    <template #main>
      <div v-loading="loading">
        <div v-for="item in modelList" :key="item.model?.key">
          <!-- 展示 model -->
          <div class="model-panel">
            <el-row type="flex" align="middle">
              <div class="title">{{ item.model?.name }}</div>
            </el-row>
            <div class="divider"></div>
          </div>
          <!-- 展示 project -->
          <el-row flex class="project-list">
            <el-card
              v-for="projItem in item.project"
              :key="projItem.key"
              class="project-card"
            >
              <template #header>
                <div class="title">
                  <span>{{ projItem.name }}</span>
                </div>
              </template>
              <div class="content">
                <span class="desc">{{ projItem.desc ?? '暂无描述' }}</span>
              </div>
              <template #footer>
                <el-row justify="end">
                  <el-button link type="primary" @click="onEnter(projItem)"
                    >进入项目</el-button
                  >
                </el-row>
              </template>
            </el-card>
          </el-row>
        </div>
      </div>
    </template>
  </HeaderContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import $curl from '@common/curl'
import HeaderContainer from '@widgets/header-container/header-container'
const loading = ref(false)
const modelList = ref([])

onMounted(() => {
  getModelList()
})

const getModelList = async () => {
  loading.value = true
  const res = await $curl({
    method: 'get',
    url: '/api/project/model_list',
    errorMessage: '获取项目列表失败',
  })
  loading.value = false

  if (!res || !res.success || !res.data) {
    return
  }

  modelList.value = res.data
}

const onEnter = (projItem) => {
  const { origin } = window.location
  console.log(projItem)
  console.log(`${origin}/view/dashboard#${projItem.homePage}`)
  window.open(`${origin}/view/dashboard#${projItem.homePage}`)
}
</script>

<style lang="less" scoped>
.model-panel {
  margin: 20px 50px;
  min-width: 500px;

  .title {
    font-size: 25px;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }

  .divider {
    margin-top: 10px;
    border-bottom: 1px dashed #e6e6e6;
    width: 100%;
  }
}

.project-list {
  margin: 0 50px;

  .project-card {
    margin-right: 30px;
    margin-bottom: 20px;
    width: 300px;

    .title {
      font-size: 18px;
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
    .content {
      height: 70px;
      font-size: 15px;
    }
  }
}
</style>
