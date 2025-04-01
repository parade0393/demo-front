import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateThemeColors, applyTheme } from '@/utils/theme'

// 定义配置项的类型
export interface ThemeConfig {
  primaryColor: string
  // 后续可以添加更多主题相关配置
}

// 定义所有配置项的类型
export interface AppConfig {
  theme: ThemeConfig
  // 后续可以添加更多配置项类别
}

// 默认配置
const defaultConfig: AppConfig = {
  theme: {
    primaryColor: '#409EFF', // Element Plus 默认主题色
  },
}

// 创建配置中心store
export const useConfigStore = defineStore('config', () => {
  // 使用ref存储配置，方便响应式更新
  const config = ref<AppConfig>({ ...defaultConfig })

  // 更新主题色
  function updateThemeColor(color: string) {
    config.value.theme.primaryColor = color

    // 更新CSS变量，实现动态主题切换
    document.documentElement.style.setProperty('--el-color-primary', color)

    const colors = generateThemeColors(color)
    applyTheme(colors)
  }

  // 重置配置到默认值
  function resetConfig() {
    config.value = { ...defaultConfig }
    updateThemeColor(defaultConfig.theme.primaryColor)
  }

  return {
    config,
    updateThemeColor,
    resetConfig,
  }
})
