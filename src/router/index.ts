import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { title: '仪表盘' },
        },
        {
          path: '/system',
          name: 'System',
          component: () => import('@/views/system/index.vue'),
          meta: { title: '系统管理' },
          redirect: '/system/user',
          children: [
            {
              path: '/system/user',
              name: 'User',
              component: () => import('@/views/system/user/index.vue'),
              meta: { title: '用户管理' },
            },
            {
              path: '/system/role',
              name: 'Role',
              component: () => import('@/views/system/role/index.vue'),
              meta: { title: '角色管理' },
            },
          ],
        },
        {
          path: '/content',
          name: 'Content',
          component: () => import('@/views/content/index.vue'),
          meta: { title: '内容管理' },
          redirect: '/content/article',
          children: [
            {
              path: '/content/article',
              name: 'Article',
              component: () => import('@/views/content/article/index.vue'),
              meta: { title: '文章管理' },
            },
            {
              path: '/content/category',
              name: 'Category',
              component: () => import('@/views/content/category/index.vue'),
              meta: { title: '分类管理' },
            },
          ],
        },
        {
          path: '/api-demo',
          name: 'ApiDemo',
          component: () => import('@/views/ApiDemo.vue'),
          meta: { title: 'API演示' },
        },
      ],
    },
  ],
})

export default router
