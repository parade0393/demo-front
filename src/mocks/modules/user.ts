/**
 * 用户相关Mock数据
 */
import { http, HttpResponse, delay } from 'msw'
import { createResponse } from '../index'
import type { UserInfo } from '@/api/modules/user'
import type { ServerMenuItem } from '@/api/modules/user'

// admin用户的菜单数据
const adminMenus: ServerMenuItem[] = [
  {
    path: '/system',
    component: 'Layout',
    redirect: '/system/user',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'Setting',
      hidden: false,
      alwaysShow: false,
    },
    children: [
      {
        path: 'user',
        component: 'system/user/index',
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'role',
        component: 'system/role/index',
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'menu',
        component: 'system/menu/index',
        name: 'SysMenu',
        meta: {
          title: '菜单管理',
          icon: 'Menu',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'dept',
        component: 'system/dept/index',
        name: 'Dept',
        meta: {
          title: '部门管理',
          icon: 'OfficeBuilding',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/content',
    component: 'Layout',
    redirect: '/content/article',
    name: 'Content',
    meta: {
      title: '内容管理',
      icon: 'Document',
      hidden: false,
      alwaysShow: false,
    },
    children: [
      {
        path: 'article',
        component: 'content/article/index',
        name: 'Article',
        meta: {
          title: '文章管理',
          icon: 'Tickets',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
      {
        path: 'category',
        component: 'content/category/index',
        name: 'Category',
        meta: {
          title: '分类管理',
          icon: 'Files',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
  {
    path: '/api-demo',
    component: 'Layout',
    name: 'ApiDemo',
    meta: {
      title: 'API演示',
      icon: 'Test',
      hidden: false,
      alwaysShow: false,
    },
    children: [
      {
        path: 'index',
        component: 'ApiDemo',
        name: 'ApiDemoPage',
        meta: {
          title: 'API演示',
          icon: 'Test',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
]

// test用户的菜单数据（只有部分权限）
const testMenus: ServerMenuItem[] = [
  {
    path: '/content',
    component: 'Layout',
    redirect: '/content/article',
    name: 'Content',
    meta: {
      title: '内容管理',
      icon: 'Document',
      hidden: false,
      alwaysShow: false,
    },
    children: [
      {
        path: 'article',
        component: 'content/article/index',
        name: 'Article',
        meta: {
          title: '文章管理',
          icon: 'Tickets',
          hidden: false,
          keepAlive: true,
          alwaysShow: false,
        },
      },
    ],
  },
]

// 用户相关的Mock处理程序
export const userHandlers = [
  // 用户登录
  http.post('/api/login', async ({ request }) => {
    // 模拟网络延迟
    await delay(500)

    const body = (await request.json()) as { username: string; password: string }
    let token = ''
    // 模拟登录验证
    if (body.username === 'admin' && body.password === '123456') {
      token = 'admin-token-123456'
    } else if (body.username === 'test' && body.password === '123456') {
      token = 'test-token-123456'
    }
    if (token) {
      localStorage.setItem('token', token)
      return HttpResponse.json(
        createResponse({
          token,
        }),
      )
    }

    // 登录失败
    return HttpResponse.json(createResponse(null, 1001, '用户名或密码错误'), { status: 200 })
  }),

  // 获取用户信息
  http.get('/api/user/info', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (authHeader?.includes('admin-token')) {
      return HttpResponse.json(
        createResponse<Partial<UserInfo>>({
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          permissions: ['*'],
        }),
      )
    } else if (authHeader?.includes('test-token')) {
      return HttpResponse.json(
        createResponse<Partial<UserInfo>>({
          id: 2,
          username: 'test',
          email: 'test@example.com',
          permissions: ['content:article:view'],
        }),
      )
    }

    // 未授权
    return HttpResponse.json(createResponse(null, 401, '未授权'), { status: 401 })
  }),

  // 获取用户菜单
  http.get('/api/user/menus', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (authHeader?.includes('admin-token')) {
      return HttpResponse.json(createResponse(adminMenus))
    } else if (authHeader?.includes('test-token')) {
      return HttpResponse.json(createResponse(testMenus))
    }
    // 未授权
    return HttpResponse.json(createResponse(null, 401, '未授权'), { status: 401 })
  }),

  // 退出登录
  http.post('/api/logout', () => {
    return HttpResponse.json(createResponse(null))
  }),
]
