/**
 * 布局策略钩子函数
 * 用于获取当前布局模式对应的布局策略
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { LayoutStrategyFactory } from '@/layout/strategies/LayoutStrategyFactory'
import type { LayoutStrategy } from '@/layout/strategies/LayoutStrategy'
import type { RouteRecordRaw } from 'vue-router'
/**
 * 使用布局策略
 * @returns 布局策略相关的数据和方法
 */
export function useLayoutStrategy() {
  const currentRoute = useRoute()
  const configStore = useConfigStore()
  const factory = LayoutStrategyFactory.getInstance()

  // 获取布局模式
  const layoutMode = computed(() => configStore.config.layout.layoutMode)

  // 获取当前布局策略
  const currentStrategy = computed<LayoutStrategy>(() => {
    return factory.getStrategy(layoutMode.value)
  })

  // 当前激活的顶级菜单
  const activeTopMenu = computed(() => {
    if (layoutMode.value === 'top-menu') {
      return currentRoute.path
    }
    const result =
      currentRoute.path.split('/').filter(Boolean).length > 0
        ? currentRoute.path.match(/^\/[^\/]+/)?.[0] || '/'
        : '/'
    return result
  })

  // 是否显示顶部菜单
  const showTopMenu = computed(() => {
    return currentStrategy.value.showTopMenu()
  })

  // 是否显示侧边菜单
  const showSideMenu = computed(() => {
    return currentStrategy.value.showSideMenu()
  })

  // 获取顶部菜单项
  const getTopMenuItems = (menuItems: RouteRecordRaw[]) => {
    return currentStrategy.value.getTopMenuItems(menuItems)
  }

  // 获取侧边菜单项
  const getSideMenuItems = (menuItems: RouteRecordRaw[]) => {
    return currentStrategy.value.getSideMenuItems(menuItems, activeTopMenu.value)
  }

  // 获取当前激活的菜单项
  const getActiveMenu = (mode: 'horizontal' | 'vertical') => {
    return currentStrategy.value.getActiveMenu(currentRoute.path, activeTopMenu.value, mode)
  }

  // 判断是否显示子菜单
  const shouldShowSubMenu = (mode: 'horizontal' | 'vertical') => {
    // 混合模式的顶部菜单不显示子菜单
    return !(mode === 'horizontal' && layoutMode.value === 'mixed')
  }

  return {
    layoutMode,
    currentStrategy,
    activeTopMenu,
    showTopMenu,
    showSideMenu,
    getTopMenuItems,
    getSideMenuItems,
    getActiveMenu,
    shouldShowSubMenu,
    currentRoute,
  }
}
