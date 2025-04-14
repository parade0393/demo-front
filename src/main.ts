import '@/styles/index.scss' // 引入全局样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入并启动MSW（仅在开发环境）
import { setupMSW } from './mocks'
setupMSW()

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  // size: 'small', // 设置组件的默认大小
  // zIndex: 3000, // 设置组件的默认z-index
})
//导入所有图标并进行全局注册。
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
