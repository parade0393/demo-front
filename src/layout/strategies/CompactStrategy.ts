/**
 * 紧凑布局策略
 * 提供一种更节省空间的界面布局选项
 */
import type { MenuItem } from '@/config/menu'
import type { LayoutStrategy } from './LayoutStrategy'

export class CompactStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 紧凑模式不显示顶部菜单，返回空数组
   */
  getTopMenuItems(_menuItems: MenuItem[]): MenuItem[] {
    return []
  }

  /**
   * 获取侧边菜单项 - 紧凑模式显示所有菜单项，但可能会以更紧凑的方式呈现
   */
  getSideMenuItems(menuItems: MenuItem[], _activeTopMenu: string): MenuItem[] {
    return menuItems
  }

  /**
   * 是否显示顶部菜单 - 紧凑模式不显示顶部菜单
   */
  showTopMenu(): boolean {
    return false
  }

  /**
   * 是否显示侧边菜单 - 紧凑模式显示侧边菜单
   */
  showSideMenu(): boolean {
    return true
  }

  /**
   * 获取当前激活的菜单项 - 紧凑模式直接使用当前路径
   */
  getActiveMenu(
    currentPath: string,
    _activeTopMenu: string,
    _mode: 'horizontal' | 'vertical',
  ): string {
    return currentPath
  }
}
