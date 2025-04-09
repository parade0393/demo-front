import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 重定向路由，用于刷新页面
    {
      path: '/redirect',
      component: HomeView,
      meta: { hidden: true },
      children: [
        {
          path: '/redirect/:path(.*)',
          component: () => import('@/views/redirect/index.vue'),
          meta: { hidden: true, title: '页面重定向' },
        },
      ],
    },
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
          path: 'muti-level',
          name: 'MutiLevel',
          component: () => import('@/views/muti-level/index.vue'),
          meta: { title: '多级菜单' },
          redirect: '/muti-level/level-1',
          children: [
            {
              path: '/muti-level/level-1',
              name: 'Level1',
              component: () => import('@/views/muti-level/level-1/index.vue'),
              meta: { title: '一级菜单' },
              redirect: '/muti-level/level-1/level-2',
              children: [
                {
                  path: '/muti-level/level-1/level-2',
                  name: 'Level2',
                  component: () => import('@/views/muti-level/level-1/level-2/index.vue'),
                  meta: { title: '二级菜单' },
                  redirect: '/muti-level/level-1/level-2/level-3',
                  children: [
                    {
                      path: '/muti-level/level-1/level-2/level-3',
                      name: 'Level3',
                      component: () =>
                        import('@/views/muti-level/level-1/level-2/level-3/index.vue'),
                      meta: { title: '三级菜单' },
                      redirect: '/muti-level/level-1/level-2/level-3/level-3-1',
                      children: [
                        {
                          path: '/muti-level/level-1/level-2/level-3/level-3-1',
                          name: 'Level3-1',
                          component: () =>
                            import(
                              '@/views/muti-level/level-1/level-2/level-3/level-3-1/index.vue'
                            ),
                          meta: { title: '四级菜单-1' },
                        },
                        {
                          path: '/muti-level/level-1/level-2/level-3/level-3-2',
                          name: 'Level3-2',
                          component: () =>
                            import(
                              '@/views/muti-level/level-1/level-2/level-3/level-3-2/index.vue'
                            ),
                          meta: { title: '四级菜单-2' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
})

export default router
