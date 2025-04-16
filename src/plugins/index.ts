import type { App } from 'vue'
import { setupElementPlus } from './element'
import { setupPinia } from './pinia'
import { setupRouter } from './router'
import { setupMock } from './mock'
import { hideLoading, updateLoadingTip, getStartupTime, resetStartupTime } from './loading'

export { setupMock, hideLoading, updateLoadingTip, getStartupTime, resetStartupTime }

/**
 * 注册所有插件
 */
export function setupPlugins(app: App): void {
  // 更新加载提示
  updateLoadingTip('正在初始化应用...')

  // 注册插件
  setupPinia(app)
  updateLoadingTip('正在配置路由...')
  setupRouter(app)
  updateLoadingTip('正在加载UI组件...')
  setupElementPlus(app)
}
