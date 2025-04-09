import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import { useLayoutStrategy } from './useLayoutStrategy'

/**
 * 菜单相关的公共逻辑
 * 注意：布局相关的逻辑已移至useLayoutStrategy
 */
export function useMenu() {
  const router = useRouter()
  const configStore = useConfigStore()
  const { layoutMode, showTopMenu, activeTopMenu, currentRoute } = useLayoutStrategy()

  // 获取主题色
  const primaryColor = computed(() => configStore.config.theme.primaryColor)

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
