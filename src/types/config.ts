// 布局模式类型
export type LayoutMode = 'left-sidebar' | 'right-sidebar' | 'top-menu' | 'mixed' | 'compact'

// 标签页风格类型
export type TagsViewStyle = 'card' | 'line' | 'capsule' | 'compact'

// 侧边栏风格类型
export type SidebarStyle = 'classic-blue' | 'simple-white'

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
  // 侧边栏风格
  sidebarStyle: SidebarStyle
}

// 布局配置类型定义
export interface LayoutConfig {
  // 布局模式
  layoutMode: LayoutMode
  // 标签页风格
  tagsViewStyle: TagsViewStyle
}

// 应用全局配置类型定义
export interface AppConfig {
  // 主题相关配置
  theme: ThemeConfig
  // 布局相关配置
  layout: LayoutConfig
}
