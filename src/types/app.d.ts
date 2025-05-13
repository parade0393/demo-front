// 布局模式类型
type LayoutMode = 'left-sidebar' | 'right-sidebar' | 'top-menu' | 'mixed' | 'compact'

// 标签页风格类型
type TagsViewStyle = 'card' | 'line' | 'capsule' | 'compact'

type SidebarStyle = 'classic-blue' | 'simple-white' | 'dark-purple'

// 主题配置类型定义
interface ThemeConfig {
  // 主题色
  primaryColor: string
  // 暗色模式
  darkMode: boolean
  // 哀悼模式（黑白模式）
  mourningMode: boolean
  // 色弱模式
  colorWeakMode: boolean
  sidebarStyle: SidebarStyle
}

// 应用全局配置类型定义
interface AppConfig {
  // 主题相关配置
  theme: ThemeConfig
  layout: {
    layoutMode: LayoutMode
    tagsViewStyle: TagsViewStyle
  }
}
