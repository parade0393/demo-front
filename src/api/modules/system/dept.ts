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
}
