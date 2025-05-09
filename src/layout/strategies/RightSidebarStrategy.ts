/**
 * 右侧菜单布局策略
 */
import type { LayoutStrategy } from './LayoutStrategy'
import type { RouteRecordRaw } from 'vue-router'
export class RightSidebarStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 右侧菜单模式不显示顶部菜单，返回空数组
   */
  getTopMenuItems(_menuItems: RouteRecordRaw[]): RouteRecordRaw[] {
    return []
  }

  /**
   * 获取侧边菜单项 - 右侧菜单模式显示所有菜单项
   */
  getSideMenuItems(menuItems: RouteRecordRaw[], _activeTopMenu: string): RouteRecordRaw[] {
    return menuItems
  }

  /**
   * 是否显示顶部菜单 - 右侧菜单模式不显示顶部菜单
   */
  showTopMenu(): boolean {
    return false
  }

  /**
   * 是否显示侧边菜单 - 右侧菜单模式显示侧边菜单
   */
  showSideMenu(): boolean {
    return true
  }

  /**
   * 获取当前激活的菜单项 - 右侧菜单模式直接使用当前路径
   */
  getActiveMenu(
    currentPath: string,
    _activeTopMenu: string,
    _mode: 'horizontal' | 'vertical',
  ): string {
    return currentPath
  }
}
