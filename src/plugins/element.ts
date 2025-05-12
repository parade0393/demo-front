import type { App } from 'vue'
import 'element-plus/theme-chalk/src/message.scss'
import 'element-plus/theme-chalk/src/message-box.scss'
// 暗黑主题样式
import 'element-plus/theme-chalk/dark/css-vars.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export function setupElementPlus(app: App): void {
  // 注册所有图标
  Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component)
  })
}
