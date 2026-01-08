<template>
  <h1>page1</h1>
  <input v-model="content" />
  <div>{{ content }}</div>
  <h1>123</h1>
  <h2>yellow</h2>
</template>

<script setup>
import { ref } from 'vue'
import { utils } from '@common/utils'
import './index.css'

const content = ref('')
console.log('page1 init')

utils()
</script>

<style lang="less" scoped>
h1 {
  color: red;
}
</style>
