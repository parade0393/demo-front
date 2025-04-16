import '@/styles/index.scss' // 引入全局样式

import { createApp } from 'vue'
import App from './App.vue'
import { setupPlugins, setupMock } from './plugins'

/**
 * 启动应用的异步函数
 */
async function bootstrap() {
  // 1. 初始化Mock服务(如果启用)
  await setupMock()

  // 2. 创建应用实例
  const app = createApp(App)

  // 3. 注册所有插件
  setupPlugins(app)

  // 4. 挂载应用
  app.mount('#app')
}

// 启动应用
bootstrap().catch((err) => console.error('应用启动失败:', err))
