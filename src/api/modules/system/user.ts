/**
 * 用户相关API
 */
import request from '@/utils/request'

/**
 * 用户列表项接口
 */
export interface UserItem {
  /** ID，主键，自增 */
  id: number
  /** 用户名 */
  username: string
  /** 姓名 */
  name: string
  /** 手机号 */
  phone: string
  /** 邮箱 */
  email: string
  /** 部门ID */
  deptId: number
  /** 部门名称 */
  deptName: string
  /** 头像 */
  avatar: string | null
  /** 状态（1-正常 0-停用） */
  status: number
  /** 状态名称 */
  statusName: string
  /** 备注 */
  remark: string | null
  /** 最后登录时间 */
  lastLoginTime: string | null
  /** 创建时间 */
  createTime: string
  /** 角色ID列表 */
  roleIds: number[]
  /** 角色名称列表 */
  roleNames: string[] | null
}

/**
 * 用户列表分页结果
 */
export interface UserPageResult {
  /** 记录列表 */
  records: UserItem[]
  /** 总记录数 */
  total: number
  /** 每页记录数 */
  size: number
  /** 当前页码 */
  current: number
  /** 总页数 */
  pages: number
}

/**
 * 用户查询参数
 */
export interface UserQueryParams {
  /** 部门ID */
  deptId?: number
  /** 页码 */
  current?: number
  /** 每页记录数 */
  size?: number
}

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户分页列表
   * @param params 查询参数
   * @returns 用户分页列表
   */
  fetchUserPageApi(params: UserQueryParams) {
    return request.get<UserPageResult>('/api/user/list', params)
  },
}
