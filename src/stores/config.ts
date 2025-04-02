import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toggleDarkMode, toggleMourningMode, toggleColorWeakMode, applyTheme } from '@/utils/theme'
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
    applyTheme(color)
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

  return {
    config,
    updateThemeColor,
    toggleDarkTheme,
    toggleMourning,
    toggleColorWeak,
  }
})
