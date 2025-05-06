import request from '@/utils/request'

/**
 * 菜单项接口
 */
export interface MenuItem {
  /** ID，主键，自增 */
  id: number
  /** 父节点ID */
  parent_id: number
  /** 父节点路径 */
  tree_path: string | null
  /** 菜单名称 */
  name: string
  /** 菜单类型（1-目录 2-菜单 3-按钮 4-外链） */
  type: number
  /** 路由名称（Vue Router命名路由） */
  route_name: string | null
  /** 路由路径或外链地址 */
  route_path: string | null
  /** 组件路径（相对于 src/views/） */
  component: string | null
  /** 按钮权限标识 */
  perm: string | null
  /** 是否总是显示目录路由（1-是 0-否） */
  always_show: number | null
  /** 是否开启页面缓存（1-是 0-否） */
  keep_alive: number | null
  /** 显示状态（1-显示 0-隐藏） */
  visible: number
  /** 排序值 */
  sort: number
  /** 菜单图标 */
  icon: string | null
  /** 跳转路径 */
  redirect: string | null
  /** 创建时间 */
  create_time: string
  /** 更新时间 */
  update_time: string | null
  /** 路由参数 */
  params: string | null
  /** 子菜单 */
  children?: MenuItem[]
}

/**
 * 菜单相关API
 */
export const menuApi = {
  /**
   * 获取菜单列表
   * @returns 菜单列表
   */
  fetchUserMenuListApi() {
    return request.get<MenuItem[]>('/api/menu/list')
  },
}
