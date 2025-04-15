/**
 * 权限管理Store
 * 用于管理用户权限、动态路由等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import router from '@/router'
import type { ServerMenuItem, UserInfo } from '@/api/modules/user'

// 布局组件
export const Layout = () => import('@/layout/index.vue')

// 静态路由（不需要权限的路由）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true },
  },
]

// 使用 import.meta.glob 动态导入所有视图组件
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * 将后端返回的菜单数据转换为路由配置
 * @param menus 后端返回的菜单数据
 */
function generateRoutes(menus: ServerMenuItem[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  for (const menu of menus) {
    const route = { ...menu } as RouteRecordRaw

    // 处理组件
    if (route.component?.toString() === 'Layout') {
      route.component = Layout
    } else {
      // 动态导入组件，解析失败时使用 404 页面
      const componentPath = `@/views/${menu.component}.vue`
      route.component = modules[componentPath]
        ? modules[componentPath]
        : () => import('@/views/error/404.vue')
    }

    // 处理子路由
    if (menu.children && menu.children.length > 0) {
      route.children = generateRoutes(menu.children)
    }

    result.push(route)
  }

  return result
}

// 权限管理Store
export const usePermissionStore = defineStore('permission', () => {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null)
  // 用户Token
  const token = ref<string>('')
  // 动态路由
  const dynamicRoutes = ref<RouteRecordRaw[]>([])
  // 所有路由（静态+动态）
  const routes = computed(() => [...constantRoutes, ...dynamicRoutes.value])

  // 路由是否加载完成
  const isRoutesLoaded = ref(false)

  /**
   * 设置用户信息
   * @param info 用户信息
   */
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  /**
   * 设置用户Token
   * @param userToken 用户Token
   */
  function setToken(userToken: string) {
    token.value = userToken
    // 保存到localStorage
    localStorage.setItem('token', userToken)
  }

  /**
   * 获取Token
   */
  function getToken(): string {
    if (!token.value) {
      // 从localStorage获取
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        token.value = storedToken
      }
    }
    return token.value
  }

  /**
   * 生成动态路由
   * @param menus 后端返回的菜单数据
   */
  function generateDynamicRoutes(menus: ServerMenuItem[]) {
    // 生成路由配置
    const routes = generateRoutes(menus)
    dynamicRoutes.value = routes

    // 添加路由
    routes.forEach((route) => {
      router.addRoute(route)
    })
    isRoutesLoaded.value = true
  }

  /**
   * 重置权限状态
   */
  function resetPermission() {
    userInfo.value = null
    token.value = ''
    dynamicRoutes.value = []
    // 清除localStorage中的token
    localStorage.removeItem('token')
    // 重置路由
    resetRouter()
  }

  /**
   * 重置路由
   */
  function resetRouter() {
    // 移除所有动态添加的路由
    dynamicRoutes.value.forEach((route) => {
      if (route.name) {
        router.removeRoute(route.name)
      }
    })
    isRoutesLoaded.value = false
  }

  return {
    userInfo,
    token,
    routes,
    dynamicRoutes,
    setUserInfo,
    setToken,
    getToken,
    generateDynamicRoutes,
    resetPermission,
    isRoutesLoaded,
  }
})
