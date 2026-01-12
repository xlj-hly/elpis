<template>
  <h1>page1</h1>
  <input v-model="content" />
  <div>{{ content }}</div>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="description" label="Description" />
  </el-table>
  <h2>yellow</h2>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { utils } from '@common/utils'
import './index.css'
import $curl from '@common/curl'

const content = ref('')
console.log('page1 init')

utils()

const tableData = ref([])

onMounted(async () => {
  await $curl({
    url: '/api/project/list',
    method: 'get',
    query: {
      proj_key: '123',
    },
  }).then((res) => {
    tableData.value = res.data
  })
})
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
