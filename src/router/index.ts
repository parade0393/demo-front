import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
})

export default router
