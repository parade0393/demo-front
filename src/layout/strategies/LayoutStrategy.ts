/**
 * 布局策略接口
 * 定义了不同布局模式需要实现的方法
 */
import type { RouteRecordRaw } from 'vue-router'

export interface LayoutStrategy {
  /**
   * 获取顶部菜单项
   * @param menuItems 所有菜单项
   * @returns 顶部菜单项
   */
  getTopMenuItems(menuItems: RouteRecordRaw[]): RouteRecordRaw[]

  /**
   * 获取侧边菜单项
   * @param menuItems 所有菜单项
   * @param activeTopMenu 当前激活的顶级菜单路径
   * @returns 侧边菜单项
   */
  getSideMenuItems(menuItems: RouteRecordRaw[], activeTopMenu: string): RouteRecordRaw[]

  /**
   * 是否显示顶部菜单
   * @returns 是否显示顶部菜单
   */
  showTopMenu(): boolean

  /**
   * 是否显示侧边菜单
   * @returns 是否显示侧边菜单
   */
  showSideMenu(): boolean

  /**
   * 获取当前激活的菜单项
   * @param currentPath 当前路由路径
   * @param activeTopMenu 当前激活的顶级菜单路径
   * @param mode 菜单模式 (horizontal | vertical)
   * @returns 当前激活的菜单项路径
   */
  getActiveMenu(currentPath: string, activeTopMenu: string, mode: 'horizontal' | 'vertical'): string
}
