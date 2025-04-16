import type { App } from 'vue'
import { setupElementPlus } from './element'
import { setupPinia } from './pinia'
import { setupRouter } from './router'
import { setupMock } from './mock'

export { setupMock }

/**
 * 注册所有插件
 */
export function setupPlugins(app: App): void {
  // 注册插件
  setupPinia(app)
  setupRouter(app)
  setupElementPlus(app)
}
