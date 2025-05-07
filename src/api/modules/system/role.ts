import request from '@/utils/request'

/**
 * 角色项接口
 */
export interface RoleItem {
  /** ID，主键，自增 */
  id: number
  /** 角色名称 */
  name: string
  /** 角色编码 */
  code: string
  /** 状态（1-正常 0-停用） */
  status: number
  /** 备注 */
  remark: string | null
  /** 排序值 */
  sort: number
  /** 是否删除（1-已删除 0-未删除） */
  isDeleted?: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime?: string | null
}

/**
 * 角色相关API
 */
export const roleApi = {
  /**
   * 获取角色列表
   * @returns 角色列表
   */
  fetchRoleListApi() {
    return request.get<RoleItem[]>('/api/role/all')
  },

  /**
   * 更新角色
   * @param data 角色数据
   * @returns 是否成功
   */
  updateRoleApi(data: RoleItem) {
    return request.post<boolean, RoleItem>('/api/role/update', data)
  },

  /**
   * 添加角色
   * @param data 角色数据
   * @returns 是否成功
   */
  addRoleApi(data: RoleItem) {
    return request.post<boolean, RoleItem>('/api/role/create', data)
  },

  /**
   * 删除角色
   * @param id 角色ID
   * @returns 是否成功
   */
  deleteRoleApi(id: number) {
    return request.get<boolean>('/api/role/delete', { roleId: id })
  },

  /**
   * 获取角色权限
   * @param roleId 角色ID
   * @returns 权限ID列表
   */
  getRoleMenusApi(roleId: number) {
    return request.get<number[]>(`/api/role/${roleId}/menus`)
  },

  /**
   * 分配角色权限
   * @param roleId 角色ID
   * @param menuIds 权限ID列表
   * @returns 是否成功
   */
  assignRoleMenusApi(roleId: number, menuIds: number[]) {
    return request.post<boolean>(`/api/role/assign-menus`, { roleId, menuIds })
  },
}
