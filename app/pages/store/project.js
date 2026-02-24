import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
  // 项目信息
  const projectList = ref([])

  // 设置项目信息
  const setProjectList = (list) => {
    projectList.value = list
  }

  return {
    projectList,
    setProjectList,
  }
})
