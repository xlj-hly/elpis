import { createPinia } from 'pinia'
const pinia = createPinia()

export { pinia }

export { useProjectStore } from './project'
export { useMenuStore } from './menu'
