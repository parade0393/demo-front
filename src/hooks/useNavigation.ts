import { ref, computed, nextTick } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

const cacheViews = ref<Set<string>>(new Set())

export function useNavigation() {
  // 计算当前需要缓存的组件列表
  const keepAliveComponents: ComputedRef<string[]> = computed(() => {
    return Array.from(cacheViews.value)
  })

  // 如果目标页面需要在进入时重置
  const handleRouteChange = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.meta?.resetOnEnter) {
      const exceptFromRoutes = (to.meta.exceptFrom || []) as string[]
      const customResetCondition =
        typeof to.meta.resetWhen === 'function' ? to.meta.resetWhen(to, from) : false

      if (!exceptFromRoutes.includes(from.name as string) || customResetCondition) {
        cacheViews.value.delete(to.name as string)
      }
    }

    // 如果目标页面需要缓存，添加到缓存列表
    if (to.meta.keepAlive) {
      // 确保在下一个tick添加缓存，避免移除后立即添加的问题
      nextTick(() => {
        console.log(to)
        cacheViews.value.add(to.name as string)
      })
    }
  }
  return {
    keepAliveComponents,
    handleRouteChange,
  }
}
