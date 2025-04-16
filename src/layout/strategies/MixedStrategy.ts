/**
 * 混合布局策略（顶部+侧边）
 */
import type { LayoutStrategy } from './LayoutStrategy'
import type { RouteRecordRaw } from 'vue-router'
import { getVisibleChildren, shouldShowSubMenu, processMenuItemPath } from '@/utils/menu'

// 存储原始菜单项的映射，键为处理后的路径，值为父级菜单
const originalMenuMap = new Map<string, RouteRecordRaw>()

/**
 * 处理菜单项，使其符合显示规则
 */
const processMenuItem = (menuItem: RouteRecordRaw): RouteRecordRaw[] => {
  const visibleChildren = getVisibleChildren(menuItem)

  // 如果没有子节点或只有一个子节点且不需要显示子菜单，则返回自身
  if (
    visibleChildren.length === 0 ||
    (visibleChildren.length === 1 && !shouldShowSubMenu(menuItem))
  ) {
    // 如果只有一个子节点，使用子节点的信息
    if (visibleChildren.length === 1) {
      const processedItem = processMenuItemPath(visibleChildren[0], menuItem.path)
      // 保存父级菜单的引用
      originalMenuMap.set(processedItem.path, menuItem)
      return [processedItem]
    }
    return [menuItem]
  }

  // 如果有多个子节点或需要显示子菜单，则返回自身（不包含子节点）
  const { children: _, ...rest } = menuItem
  return [rest as RouteRecordRaw]
}

export class MixedStrategy implements LayoutStrategy {
  /**
   * 获取顶部菜单项 - 混合模式只在顶部显示一级菜单
   */
  getTopMenuItems(menuItems: RouteRecordRaw[]): RouteRecordRaw[] {
    // 清空映射
    originalMenuMap.clear()
    // 处理每个菜单项，使其符合显示规则
    return menuItems.flatMap(processMenuItem)
  }

  /**
   * 获取侧边菜单项 - 混合模式在侧边显示当前激活顶级菜单的子菜单
   */
  getSideMenuItems(menuItems: RouteRecordRaw[], activeTopMenu: string): RouteRecordRaw[] {
    // 查找原始菜单项
    const parentMenu = originalMenuMap.get(activeTopMenu)
    if (parentMenu) {
      // 从父级菜单中获取可见的子菜单
      const visibleChildren = getVisibleChildren(parentMenu)
      // 处理子菜单的路径，确保包含父级路径
      return visibleChildren.map((child) => processMenuItemPath(child, parentMenu.path))
    }

    // 如果没有找到原始菜单项，说明是普通的一级菜单
    const activeMenu = menuItems.find((item) => item.path === activeTopMenu)
    if (!activeMenu) return []

    // 获取可见的子节点
    const visibleChildren = getVisibleChildren(activeMenu)
    // 处理子菜单的路径，确保包含父级路径
    return visibleChildren.map((child) => processMenuItemPath(child, activeMenu.path))
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
