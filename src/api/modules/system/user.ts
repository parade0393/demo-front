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
 * 用户表单数据（新增/编辑）
 */
export interface UserFormData
  extends Omit<
    UserItem,
    'id' | 'createTime' | 'statusName' | 'deptName' | 'roleNames' | 'lastLoginTime'
  > {
  /** ID，编辑时必传 */
  id?: number
  /** 密码，新增时必传 */
  password?: string
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
    return request.get<UserPageResult, UserQueryParams>('/api/user/list', params)
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  getUserDetailApi(id: number) {
    return request.get<UserItem>(`/api/user/${id}`)
  },

  /**
   * 新增用户
   * @param data 用户数据
   * @returns 是否成功
   */
  createUserApi(data: UserFormData) {
    return request.post<boolean, UserFormData>('/api/user/create', data)
  },

  /**
   * 更新用户
   * @param data 用户数据
   * @returns 是否成功
   */
  updateUserApi(data: UserFormData) {
    return request.post<boolean, UserFormData>('/api/user/update', data)
  },
}
