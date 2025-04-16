/**
 * 混合布局策略（顶部+侧边）
 */
import type { LayoutStrategy } from './LayoutStrategy'
import type { RouteRecordRaw } from 'vue-router'
export class MixedStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 混合模式只在顶部显示一级菜单
   */
  getTopMenuItems(menuItems: RouteRecordRaw[]): RouteRecordRaw[] {
    // 只返回一级菜单，保持原始类型
    return menuItems.map((item) => {
      const { children: _, ...rest } = item
      return rest as RouteRecordRaw
    })
  }

  /**
   * 获取侧边菜单项 - 混合模式在侧边显示当前激活顶级菜单的子菜单
   */
  getSideMenuItems(menuItems: RouteRecordRaw[], activeTopMenu: string): RouteRecordRaw[] {
    // 查找当前激活的顶级菜单
    const activeMenu = menuItems.find((item) => item.path === activeTopMenu)

    if (!activeMenu) return []

    // 如果有子菜单且子菜单不为空，返回子菜单数组；否则返回自身作为数组
    if (activeMenu.children?.length) {
      // 处理子菜单的路径，确保包含父级路径
      return activeMenu.children.map((child) => ({
        ...child,
        path: `${activeMenu.path}/${child.path}`.replace(/\/+/g, '/'),
      }))
    }
    return [activeMenu]
  }

  /**
   * 是否显示顶部菜单 - 混合模式显示顶部菜单
   */
  showTopMenu(): boolean {
    return true
  }

  /**
   * 是否显示侧边菜单 - 混合模式显示侧边菜单
   */
  showSideMenu(): boolean {
    return true
  }

  /**
   * 获取当前激活的菜单项
   * 混合模式下，顶部菜单使用顶级菜单路径，侧边菜单使用当前路径
   */
  getActiveMenu(
    currentPath: string,
    activeTopMenu: string,
    mode: 'horizontal' | 'vertical',
  ): string {
    return mode === 'horizontal' ? activeTopMenu : currentPath
  }
}
