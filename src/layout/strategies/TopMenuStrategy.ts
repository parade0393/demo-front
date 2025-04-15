/**
 * 顶部菜单布局策略
 */
import type { LayoutStrategy } from './LayoutStrategy'
import type { RouteRecordRaw } from 'vue-router'
export class TopMenuStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 顶部菜单模式显示所有菜单项
   */
  getTopMenuItems(menuItems: RouteRecordRaw[]): RouteRecordRaw[] {
    return menuItems
  }

  /**
   * 获取侧边菜单项 - 顶部菜单模式不显示侧边菜单，返回空数组
   */
  getSideMenuItems(_menuItems: RouteRecordRaw[], _activeTopMenu: string): RouteRecordRaw[] {
    return []
  }

  /**
   * 是否显示顶部菜单 - 顶部菜单模式显示顶部菜单
   */
  showTopMenu(): boolean {
    return true
  }

  /**
   * 是否显示侧边菜单 - 顶部菜单模式不显示侧边菜单
   */
  showSideMenu(): boolean {
    return false
  }

  /**
   * 获取当前激活的菜单项 - 顶部菜单模式直接使用当前路径
   */
  getActiveMenu(
    currentPath: string,
    _activeTopMenu: string,
    _mode: 'horizontal' | 'vertical',
  ): string {
    return currentPath
  }
}
