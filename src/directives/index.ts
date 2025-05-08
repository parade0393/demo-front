import type { App } from 'vue'
import { permission } from './permission'

/**
 * 注册所有自定义指令
 * @param app Vue应用实例
 */
export function setupDirectives(app: App): void {
  // 注册权限指令
  app.directive('permission', permission)

  // 未来可以在这里注册更多的自定义指令
  // app.directive('其他指令名', 其他指令)
}
