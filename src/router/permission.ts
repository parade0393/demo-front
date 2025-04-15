/**
 * 路由守卫
 * 实现基于RBAC的动态路由权限控制
 */
import router from './index'
import { usePermissionStore } from '@/stores/permission'
import { userApi } from '@/api'
import { ElMessage } from 'element-plus'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

// 白名单路由（不需要登录就可以访问）
const whiteList = ['/login']

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 获取权限Store
  const permissionStore = usePermissionStore()
  // 获取Token
  const token = permissionStore.getToken()

  // 判断是否有Token
  if (token) {
    // 已登录
    if (to.path === '/login') {
      // 如果已登录，访问登录页则重定向到首页
      next({ path: '/' })
    } else {
      // 判断是否已获取用户信息
      if (permissionStore.isRoutesLoaded) {
        if (to.matched.length === 0) {
          // 没有匹配到任何路由，重定向到404页面
          next({ path: '/404', replace: true })
        }
        const title = (to.params.title as string) || (to.query.title as string)
        if (title) {
          to.meta.title = title
        }
        // 已获取用户信息，直接放行
        next()
      } else {
        try {
          // 获取用户菜单
          const menuRes = await userApi.getUserMenus()
          console.log('111111')
          // 生成动态路由
          permissionStore.generateDynamicRoutes(menuRes)

          // 确保动态路由已添加完成
          next({ ...to, replace: true })
        } catch (error: unknown) {
          // 获取用户信息失败，清空Token并跳转到登录页
          let msg = '获取用户信息失败，请重新登录'
          if (error instanceof Error) {
            msg = error.message
          }
          console.log(error)
          permissionStore.resetPermission()
          ElMessage.error(msg)
          redirectToLogin(to, next)
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接放行
      next()
    } else {
      // 不在白名单中，重定向到登录页
      redirectToLogin(to, next)
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  // 可以在这里处理页面加载完成后的逻辑
  // 例如关闭loading等
})

// 重定向到登录页
function redirectToLogin(to: RouteLocationNormalized, next: NavigationGuardNext) {
  const params = new URLSearchParams(to.query as Record<string, string>)
  const queryString = params.toString()
  const redirect = queryString ? `${to.path}?${queryString}` : to.path
  next(`/login?redirect=${encodeURIComponent(redirect)}`)
}
