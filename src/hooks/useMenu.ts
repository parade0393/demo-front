import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'

/**
 * 菜单相关的公共逻辑
 */
export function useMenu() {
  const router = useRouter()
  const currentRoute = useRoute()
  const configStore = useConfigStore()

  // 获取布局模式
  const layoutMode = computed(() => configStore.config.layout.layoutMode)

  // 获取主题色
  const primaryColor = computed(() => configStore.config.theme.primaryColor)

  // 判断是否显示顶部菜单
  const showTopMenu = computed(() => {
    return layoutMode.value === 'top-menu' || layoutMode.value === 'mixed'
  })

  // 当前激活的顶级菜单
  const activeTopMenu = computed(() => {
    if (layoutMode.value === 'top-menu') {
      return currentRoute.path
    }
    return currentRoute.path.split('/').filter(Boolean).length > 1
      ? currentRoute.path.match(/^\/[^\/]+/)?.[0] || '/'
      : '/'
  })

  // 菜单点击处理
  const handleMenuClick = (path: string) => {
    router.push(path)
  }

  return {
    layoutMode,
    primaryColor,
    showTopMenu,
    activeTopMenu,
    handleMenuClick,
    currentRoute,
  }
}
