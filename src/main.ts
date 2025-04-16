import '@/styles/index.scss' // 引入全局样式

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 导入并启动MSW（仅在开发环境）
import { setupMSW } from './mocks'

import App from './App.vue'
import router from './router'
// 导入路由守卫
import './router/permission'

// 启动应用的异步函数
async function bootstrap() {
  // 检查是否启用mock服务
  const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

  // 如果启用了mock服务，等待MSW初始化完成
  if (enableMock) {
    await setupMSW()
    console.log('已启用API模拟服务')
  }

  const app = createApp(App)
  const pinia = createPinia()
  // 使用持久化插件
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
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
}

// 启动应用
bootstrap()
