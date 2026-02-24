const { defineConfig } = require('eslint/config')
const globals = require('globals')
const eslint = require('@eslint/js')
const eslintPluginVue = require('eslint-plugin-vue')
const eslintConfigPrettier = require('eslint-config-prettier')
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig([
  // 全局忽略配置
  { ignores: ['**/dist/**', '**/node_modules/**'] },

  // ESLint 推荐配置
  eslint.configs.recommended,

  // Vue 插件推荐配置
  ...eslintPluginVue.configs['flat/recommended'],

  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Mocha 文件配置
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  // index.vue 文件允许单单词组件名
  {
    files: ['**/index.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  // 将 Prettier 作为 ESLint 的规则来运行
  eslintPluginPrettierRecommended,

  // 关闭 ESLint 中与 Prettier 冲突的规则
  eslintConfigPrettier,
])
