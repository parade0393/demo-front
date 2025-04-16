import type { RouteRecordRaw } from 'vue-router'

/**
 * 获取可见的子节点
 */
export const getVisibleChildren = (menuItem: RouteRecordRaw): RouteRecordRaw[] => {
  if (!menuItem.children || menuItem.children.length === 0) {
    return []
  }
  return menuItem.children.filter((child) => !child.meta?.hidden)
}

/**
 * 判断是否应该显示子菜单
 */
export const shouldShowSubMenu = (menuItem: RouteRecordRaw): boolean => {
  const visibleChildren = getVisibleChildren(menuItem)

  // 如果没有子节点，不显示子菜单
  if (visibleChildren.length === 0) {
    return false
  }

  // 如果有多个子节点，显示子菜单
  if (visibleChildren.length > 1) {
    return true
  }

  // 如果只有一个子节点，根据 alwaysShow 决定是否显示子菜单
  return menuItem.meta?.alwaysShow === true
}

/**
 * 获取完整路径
 */
export const getFullPath = (path: string, basePath: string = ''): string => {
  // 如果路径以 / 开头，说明是绝对路径，直接返回
  if (path.startsWith('/')) {
    return path
  }
  // 否则拼接基础路径
  return `${basePath}/${path}`.replace(/\/+/g, '/')
}

/**
 * 处理菜单项路径
 * @param menuItem 菜单项
 * @param basePath 基础路径
 * @returns 处理后的菜单项
 */
export const processMenuItemPath = (
  menuItem: RouteRecordRaw,
  basePath: string = '',
): RouteRecordRaw => {
  // 计算完整路径
  const fullPath = getFullPath(menuItem.path, basePath)
  menuItem.path = fullPath
  return menuItem
}
