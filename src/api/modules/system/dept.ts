/**
 * 部门相关API
 */
import request from '@/utils/request'

/**
 * 部门项接口
 */
export interface DeptItem {
  /** ID，主键，自增 */
  id: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string | null
  /** 父节点ID */
  parentId: number
  /** 部门名称 */
  name: string
  /** 部门负责人 */
  leader: string
  /** 联系电话 */
  phone: string
  /** 邮箱 */
  email: string
  /** 状态（1-正常 0-停用） */
  status: number
  /** 排序值 */
  sort: number
  /** 是否删除（1-已删除 0-未删除） */
  isDeleted: number
  /** 子部门 */
  children?: DeptItem[] | null
}

/**
 * 部门表单数据（新增/编辑）
 */
export interface DeptFormData
  extends Omit<DeptItem, 'id' | 'createTime' | 'updateTime' | 'children' | 'isDeleted'> {
  /** ID，编辑时必传 */
  id?: number
}

/**
 * 部门相关API
 */
export const deptApi = {
  /**
   * 获取部门树
   * @returns 部门树
   */
  fetchDeptTreeApi() {
    return request.get<DeptItem[]>('/api/dept/tree')
  },

  /**
   * 获取部门详情
   * @param id 部门ID
   * @returns 部门详情
   */
  getDeptDetailApi(id: number) {
    return request.get<DeptItem>(`/api/dept/${id}`)
  },

  /**
   * 新增部门
   * @param data 部门数据
   * @returns 是否成功
   */
  createDeptApi(data: DeptFormData) {
    return request.post<boolean, DeptFormData>('/api/dept/create', data)
  },

  /**
   * 更新部门
   * @param data 部门数据
   * @returns 是否成功
   */
  updateDeptApi(data: DeptFormData) {
    return request.post<boolean, DeptFormData>('/api/dept/update', data)
  },

  /**
   * 删除部门
   * @param id 部门ID
   * @returns 是否成功
   */
  deleteDeptApi(id: number) {
    return request.get<boolean>('/api/dept/delete', { deptId: id })
  },
}
