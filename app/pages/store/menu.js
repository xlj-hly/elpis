import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  // 菜单列表
  const menuList = ref([])

  // 设置 menu 配置
  const setMenuList = (list) => {
    menuList.value = list
  }

  /**
   * 根据 key 和 value 查找菜单项
   * @param {object} params - 参数
   * @param {string} params.key - 字段名
   * @param {string} params.value - 字段值
   * @param {array} [mList=menuList.value] - 菜单列表
   * @returns {object} 匹配到的菜单项
   */
  const findMenuItem = ({ key, value }, mList = menuList.value) => {
    for (let i = 0; i < mList.length; ++i) {
      const menuItem = mList[i]
      if (!menuItem) continue

      const { menuType, moduleType } = menuItem

      if (menuItem[key] === value) {
        return menuItem
      }

      if (menuType === 'group' && menuItem.subMenu) {
        const mItem = findMenuItem({ key, value }, menuItem.subMenu)
        if (mItem) return mItem
      }

      if (
        moduleType === 'sider' &&
        menuItem.siderConfig &&
        menuItem.siderConfig.menu
      ) {
        const mItem = findMenuItem({ key, value }, menuItem.siderConfig.menu)
        if (mItem) return mItem
      }
    }
  }

  return {
    menuList,
    setMenuList,
    findMenuItem,
  }
})
