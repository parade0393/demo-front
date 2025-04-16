import type { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function setupPinia(app: App): void {
  const pinia = createPinia()
  // 配置持久化插件
  pinia.use(piniaPluginPersistedstate)
  // 注册pinia
  app.use(pinia)
}
