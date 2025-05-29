/**
 * 权限管理Store
 * 用于管理用户权限、动态路由等
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { type RouteRecordRaw } from 'vue-router'
import router from '@/router'
import type { ServerMenuItem, UserInfo } from '@/api/modules/system/auth'
import { constantRoutes } from '@/router'
// 布局组件
export const Layout = () => import('@/layout/index.vue')

// 使用 import.meta.glob 动态导入所有视图组件
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 将后端返回的菜单数据转换为路由配置
 * @param menus 后端返回的菜单数据
 */
function generateRoutes(menus: ServerMenuItem[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = []

  for (const menu of menus) {
    // 检查是否为外链（以http或https开头）
    const isExternalLink = /^https?:\/\//.test(menu.path)

    const route: Partial<RouteRecordRaw> = {
      // 如果是外链但需要以/开头（一级菜单），则使用特殊路径格式
      path: isExternalLink && !menu.children?.length ? `/external-${menu.path}` : menu.path,
      name: menu.name || menu.path.replace(/^\//, ''), // 如果没有name，则使用path作为name
      meta: {
        title: menu.meta.title,
        icon: menu.meta.icon,
        hidden: menu.meta.hidden,
        keepAlive: menu.meta.keepAlive,
        alwaysShow: menu.meta.alwaysShow,
        // 添加外链标记和原始URL
        isExternal: isExternalLink,
        externalLink: isExternalLink ? menu.path : undefined,
      },
    }

    // 如果有重定向，添加到路由配置中
    if (menu.redirect) {
      route.redirect = menu.redirect
    }

    // 处理组件
    if (menu.component?.toString() === 'Layout') {
      route.component = Layout
    } else if (menu.component) {
      // 检查组件是否存在
      const modulePath = `../views/${menu.component}.vue`
      if (modules[modulePath]) {
        route.component = modules[modulePath]
      } else {
        console.warn(`Component not found: ${menu.component}`)
        route.component = () => import('@/views/error/404.vue')
      }
    }

    // 处理子路由
    if (menu.children?.length) {
      route.children = generateRoutes(menu.children)
    }
    result.push(route as RouteRecordRaw)
  }

  return result
}

// 权限管理Store
export const usePermissionStore = defineStore(
  'permission',
  () => {
    // 用户信息
    const userInfo = ref<UserInfo | null>(null)
    // 用户Token
    const token = ref<string>('')
    // 刷新Token
    const freshToken = ref<string>('')
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
    }

    /**
     * 获取Token
     */
    function getToken(): string {
      return token.value
    }

    function setRefreshToken(token: string) {
      freshToken.value = token
    }
    function getRefreshToken(): string {
      return freshToken.value
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
        console.log(route)
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
      freshToken.value = ''
      dynamicRoutes.value = []
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
      freshToken,
      routes,
      dynamicRoutes,
      setUserInfo,
      setToken,
      getToken,
      generateDynamicRoutes,
      resetPermission,
      isRoutesLoaded,
      setRefreshToken,
      getRefreshToken,
    }
  },
  {
    // 持久化配置
    persist: {
      // 自定义存储的key名
      key: 'user-auth',
      pick: ['token', 'freshToken', 'userInfo'],
      // 使用localStorage作为存储引擎
      storage: localStorage,
    },
  },
)
