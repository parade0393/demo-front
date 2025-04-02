import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  generateThemeColors,
  applyTheme,
  toggleDarkMode,
  toggleMourningMode,
  toggleColorWeakMode,
} from '@/utils/theme'
import type { AppConfig } from '@/types/config'
import { defaultConfig } from '@/config/theme'

// 创建配置中心store
export const useConfigStore = defineStore('config', () => {
  // 使用ref存储配置，方便响应式更新
  const config = ref<AppConfig>({ ...defaultConfig })

  // 初始化主题配置
  updateThemeColor(defaultConfig.theme.primaryColor)

  // 更新主题色
  function updateThemeColor(color: string) {
    config.value.theme.primaryColor = color

    // 更新CSS变量，实现动态主题切换
    document.documentElement.style.setProperty('--el-color-primary', color)

    const colors = generateThemeColors(color)
    applyTheme(colors)
  }

  // 切换暗色模式
  function toggleDarkTheme(isDark: boolean) {
    config.value.theme.darkMode = isDark
    toggleDarkMode(isDark)
  }

  // 切换哀悼模式
  function toggleMourning(isMourning: boolean) {
    config.value.theme.mourningMode = isMourning
    toggleMourningMode(isMourning)
  }

  // 切换色弱模式
  function toggleColorWeak(isColorWeak: boolean) {
    config.value.theme.colorWeakMode = isColorWeak
    toggleColorWeakMode(isColorWeak)
  }

  // 重置配置到默认值
  function resetConfig() {
    config.value = { ...defaultConfig }
    updateThemeColor(defaultConfig.theme.primaryColor)
    toggleDarkTheme(defaultConfig.theme.darkMode)
    toggleMourning(defaultConfig.theme.mourningMode)
    toggleColorWeak(defaultConfig.theme.colorWeakMode)
  }

  return {
    config,
    updateThemeColor,
    toggleDarkTheme,
    toggleMourning,
    toggleColorWeak,
    resetConfig,
  }
})
