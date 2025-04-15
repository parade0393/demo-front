import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/layout/index.vue'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', hidden: false },
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/views/error/404.vue'),
        meta: { title: '404', hidden: true },
      },
    ],
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: constantRoutes,
})

export default router
