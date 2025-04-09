/**
 * 左侧菜单布局策略
 */
import type { MenuItem } from '@/config/menu'
import type { LayoutStrategy } from './LayoutStrategy'

export class LeftSidebarStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 左侧菜单模式不显示顶部菜单，返回空数组
   */
  getTopMenuItems(_menuItems: MenuItem[]): MenuItem[] {
    return []
  }

  /**
   * 获取侧边菜单项 - 左侧菜单模式显示所有菜单项
   */
  getSideMenuItems(menuItems: MenuItem[], _activeTopMenu: string): MenuItem[] {
    return menuItems
  }

  /**
   * 是否显示顶部菜单 - 左侧菜单模式不显示顶部菜单
   */
  showTopMenu(): boolean {
    return false
  }

  /**
   * 是否显示侧边菜单 - 左侧菜单模式显示侧边菜单
   */
  showSideMenu(): boolean {
    return true
  }

  /**
   * 获取当前激活的菜单项 - 左侧菜单模式直接使用当前路径
   */
  getActiveMenu(
    currentPath: string,
    _activeTopMenu: string,
    _mode: 'horizontal' | 'vertical',
  ): string {
    return currentPath
  }
}
