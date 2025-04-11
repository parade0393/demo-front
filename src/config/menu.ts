import { ref } from 'vue'

// 定义菜单项接口
export interface MenuItem {
  path: string
  name: string
  icon?: string
  children?: MenuItem[]
  // 是否隐藏菜单项
  hidden?: boolean
  // 菜单项的元数据，可用于存储额外信息
  meta?: {
    // 菜单项的标题，如果不提供则使用name
    title?: string
    // 菜单项的权限，用于权限控制
    roles?: string[]
  }
}

// 菜单数据
export const menuItems = ref<MenuItem[]>([
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'Odometer',
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'Setting',
    children: [
      {
        path: '/system/user',
        name: '用户管理',
        icon: 'User',
      },
      {
        path: '/system/role',
        name: '角色管理',
        icon: 'UserFilled',
      },
    ],
  },
  {
    path: '/content',
    name: '内容管理',
    icon: 'Document',
    children: [
      {
        path: '/content/article',
        name: '文章管理',
        icon: 'Tickets',
      },
      {
        path: '/content/category',
        name: '分类管理',
        icon: 'Files',
      },
    ],
  },
])
