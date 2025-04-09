// 预设的主题色选项
export const presetColors = [
  '#409EFF', // 默认蓝色
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#9370DB', // 紫色
  '#00BFFF', // 天蓝色
  '#FF69B4', // 粉色
]

// 预设的布局模式选项
export const layoutModes = [
  'left-sidebar', // 左侧菜单布局
  'right-sidebar', // 右侧菜单布局
  'top-menu', // 顶部菜单布局
  'mixed', // 混合布局（顶部+侧边）
] as const

// 预设的标签页风格选项
export const tagsViewStyles = [
  'card', // 卡片式（带阴影）
  'line', // 线条式（只有底边框）
  'capsule', // 胶囊式（圆角）
  'compact', // 紧凑式（无边距）
] as const

// 预设的侧边栏风格选项
export const sidebarStyles = [
  'classic-blue', // 经典蓝色
  'simple-white', // 极简白色
] as const

// 默认配置
export const defaultConfig = {
  theme: {
    primaryColor: presetColors[0], // 使用预设主题色中的默认蓝色
    darkMode: false,
    mourningMode: false,
    colorWeakMode: false,
    sidebarStyle: sidebarStyles[0], // 默认使用经典蓝色侧边栏
  },
  layout: {
    layoutMode: layoutModes[0], // 默认使用左侧菜单布局
    tagsViewStyle: tagsViewStyles[0], // 默认使用卡片式标签页
  },
}
