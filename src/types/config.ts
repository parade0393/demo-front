// 主题配置类型定义
export interface ThemeConfig {
  // 主题色
  primaryColor: string
  // 暗色模式
  darkMode: boolean
  // 哀悼模式（黑白模式）
  mourningMode: boolean
  // 色弱模式
  colorWeakMode: boolean
}

// 应用全局配置类型定义
export interface AppConfig {
  // 主题相关配置
  theme: ThemeConfig
  // 后续可以添加更多配置项类别
}
