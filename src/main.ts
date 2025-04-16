import '@/styles/index.scss' // 引入全局样式

import { createApp } from 'vue'
import App from './App.vue'
import {
  setupPlugins,
  setupMock,
  hideLoading,
  updateLoadingTip,
  getStartupTime,
  resetStartupTime,
} from './plugins'

/**
 * 启动应用的异步函数
 */
async function bootstrap() {
  console.time('应用启动耗时')
  resetStartupTime() // 重置启动计时

  try {
    // 1. 更新加载提示
    updateLoadingTip('正在初始化服务...')

    // 2. 初始化Mock服务(如果启用)
    await setupMock()

    // 3. 创建应用实例
    updateLoadingTip('正在创建应用...')
    const app = createApp(App)

    // 4. 注册所有插件
    setupPlugins(app)

    // 5. 挂载应用
    updateLoadingTip('正在渲染界面...')
    app.mount('#app')

    // 6. 应用加载完成后，隐藏加载效果
    const startupTime = getStartupTime()
    console.log(`应用启动完成，耗时: ${startupTime}ms`)
    console.timeEnd('应用启动耗时')

    // 如果启动太快，至少显示加载动画1秒
    if (startupTime < 1000) {
      setTimeout(() => {
        hideLoading()
      }, 1000 - startupTime)
    } else {
      hideLoading()
    }
  } catch (err) {
    console.error('应用启动失败:', err)
    // 显示错误信息
    updateLoadingTip(`启动失败: ${err instanceof Error ? err.message : String(err)}`)
  }
}

// 启动应用
bootstrap()
