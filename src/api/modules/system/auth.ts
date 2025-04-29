/**
 * 用户相关API
 */
import request from '@/utils/request'
/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
  [key: string]: unknown
}

/**
 * 登录响应
 */
export interface LoginResult {
  token: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

/**
 * 菜单项
 */
export interface ServerMenuItem {
  path: string
  component?: string
  redirect?: string
  name: string
  meta: ServerMenuItemMeta
  children?: ServerMenuItem[]
}
export interface ServerMenuItemMeta {
  title?: string
  icon?: string
  hidden?: boolean
  keepAlive?: boolean
  alwaysShow?: boolean
}

/**
 * 用户信息类型
 */
export interface UserInfo {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 昵称 */
  nickname: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  phone: string
  /** 状态 */
  status: number
  /** 角色ID */
  roleId: number
  /** 部门ID */
  deptId: number
  /** 创建时间 */
  createTime: string
  /** 权限列表 */
  permissions?: string[]
}

export interface RoleItem {
  id: number
  name: string
  code: string
  status: number
  remark: string
  createTime: string
}

export interface DeptItem {
  id: number
  name: string
  parentId: number
  sort: number
  status: number
  createTime: string
}

/**
 * 用户相关API
 */
export default {
  /**
   * 用户登录
   * @param params 登录参数
   * @returns 登录结果
   */
  login(params: LoginParams) {
    return request.post<LoginResult>('/api/auth/login', params, {
      showLoading: true,
    })
  },

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo() {
    return request.get<UserInfo>('/api/auth/user/info')
  },

  /**
   * 获取用户菜单
   * @returns 用户菜单
   */
  getUserMenus() {
    return request.get<ServerMenuItem[]>('/api/auth/user/route')
  },

  /**
   * 退出登录
   */
  logout() {
    return request.post<null>('/api/auth/logout')
  },
}
