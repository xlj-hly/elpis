import { defineConfig } from 'eslint/config'
import globals from 'globals'
import eslint from '@eslint/js'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  // 全局忽略配置
  { ignores: ['dist', 'node_modules'] },

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

  // 将 Prettier 作为 ESLint 的规则来运行
  eslintPluginPrettierRecommended,

  // 关闭 ESLint 中与 Prettier 冲突的规则
  eslintConfigPrettier,
])
