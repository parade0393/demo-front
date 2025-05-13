/**
 * 系统管理相关Mock数据
 */
import { http, HttpResponse, delay } from 'msw'
import { createResponse } from '../index'
import type { UserInfo, RoleItem } from '@/api/modules/system/auth'

// 用户列表数据
const users: UserInfo[] = [
  {
    id: 1,
    username: 'admin',
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 1,
    roleId: 1,
    deptId: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 2,
    username: 'test',
    nickname: '测试用户',
    email: 'test@example.com',
    phone: '13800138001',
    status: 1,
    roleId: 2,
    deptId: 2,
    createTime: '2023-01-02 00:00:00',
  },
]

// 角色列表数据
const roles: RoleItem[] = [
  {
    id: 1,
    name: '超级管理员',
    code: 'admin',
    status: 1,
    remark: '拥有所有权限',
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 2,
    name: '普通用户',
    code: 'user',
    status: 1,
    remark: '普通用户权限',
    createTime: '2023-01-02 00:00:00',
  },
]

// 菜单列表数据
const menus = [
  {
    id: 1,
    name: 'Dashboard',
    path: '/dashboard',
    component: 'dashboard/index',
    parentId: 0,
    icon: 'Odometer',
    sort: 1,
    status: 1,
    type: 1, // 1: 菜单, 2: 按钮
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 2,
    name: '系统管理',
    path: '/system',
    component: 'Layout',
    parentId: 0,
    icon: 'Setting',
    sort: 2,
    status: 1,
    type: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 3,
    name: '用户管理',
    path: 'user',
    component: 'system/user/index',
    parentId: 2,
    icon: 'User',
    sort: 1,
    status: 1,
    type: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 4,
    name: '角色管理',
    path: 'role',
    component: 'system/role/index',
    parentId: 2,
    icon: 'UserFilled',
    sort: 2,
    status: 1,
    type: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 5,
    name: '菜单管理',
    path: 'menu',
    component: 'system/menu/index',
    parentId: 2,
    icon: 'Menu',
    sort: 3,
    status: 1,
    type: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 6,
    name: '部门管理',
    path: 'dept',
    component: 'system/dept/index',
    parentId: 2,
    icon: 'OfficeBuilding',
    sort: 4,
    status: 1,
    type: 1,
    createTime: '2023-01-01 00:00:00',
  },
]

// 部门列表数据
const depts = [
  {
    id: 1,
    name: '总公司',
    parentId: 0,
    sort: 1,
    status: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 2,
    name: '研发部',
    parentId: 1,
    sort: 1,
    status: 1,
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: 3,
    name: '市场部',
    parentId: 1,
    sort: 2,
    status: 1,
    createTime: '2023-01-01 00:00:00',
  },
]

// 系统管理相关Mock处理程序
export const systemHandlers = [
  // 获取用户列表
  http.get('/api/system/users', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = users.slice(start, end)

    return HttpResponse.json(
      createResponse<PageResult<UserInfo>>({
        records: list,
        total: roles.length,
        current: page,
        size: 10,
        pages: pageSize,
      }),
    )
  }),

  // 获取角色列表
  http.get('/api/system/roles', async ({ request }) => {
    await delay(500)
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const pageSize = Number(url.searchParams.get('pageSize') || 10)

    const start = (page - 1) * pageSize
    const end = start + pageSize
    const list = roles.slice(start, end)

    return HttpResponse.json(
      createResponse<PageResult<RoleItem>>({
        records: list,
        total: roles.length,
        current: page,
        size: 10,
        pages: pageSize,
      }),
    )
  }),

  // 获取菜单列表
  http.get('/api/system/menus', async () => {
    await delay(500)
    return HttpResponse.json(createResponse(menus))
  }),

  // 获取部门列表
  http.get('/api/system/depts', async () => {
    await delay(500)
    return HttpResponse.json(createResponse(depts))
  }),
]
