/**
 * 系统管理相关API
 */
import request from '@/utils/request'
import type { DeptItem, RoleItem, ServerMenuItem, UserInfo } from './user'

/**
 * 分页参数
 */
export interface PaginationParams {
  page: number
  pageSize: number
  [key: string]: unknown
}

/**
 * 分页响应
 */
export interface PaginationResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 用户管理相关API
 */
export const userApi = {
  /**
   * 获取用户列表
   * @param params 分页参数
   */
  getUsers(params: PaginationParams) {
    return request.get<PaginationResult<UserInfo>>('/api/system/users', params)
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  getUserDetail(id: number) {
    return request.get<UserInfo>(`/api/system/users/${id}`)
  },

  /**
   * 创建用户
   * @param data 用户数据
   */
  createUser(data: Partial<UserInfo>) {
    return request.post<UserInfo>('/api/system/users', data)
  },

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 用户数据
   */
  updateUser(id: number, data: Partial<UserInfo>) {
    return request.put<UserInfo>(`/api/system/users/${id}`, data)
  },

  /**
   * 删除用户
   * @param id 用户ID
   */
  deleteUser(id: number) {
    return request.delete<null>(`/api/system/users/${id}`)
  },
}

/**
 * 角色管理相关API
 */
export const roleApi = {
  /**
   * 获取角色列表
   * @param params 分页参数
   */
  getRoles(params: PaginationParams) {
    return request.get<PaginationResult<RoleItem>>('/api/system/roles', params)
  },

  /**
   * 获取角色详情
   * @param id 角色ID
   */
  getRoleDetail(id: number) {
    return request.get<RoleItem>(`/api/system/roles/${id}`)
  },

  /**
   * 创建角色
   * @param data 角色数据
   */
  createRole(data: Partial<RoleItem>) {
    return request.post<RoleItem>('/api/system/roles', data)
  },

  /**
   * 更新角色
   * @param id 角色ID
   * @param data 角色数据
   */
  updateRole(id: number, data: Partial<RoleItem>) {
    return request.put<RoleItem>(`/api/system/roles/${id}`, data)
  },

  /**
   * 删除角色
   * @param id 角色ID
   */
  deleteRole(id: number) {
    return request.delete<null>(`/api/system/roles/${id}`)
  },
}

/**
 * 菜单管理相关API
 */
export const menuApi = {
  /**
   * 获取菜单列表
   */
  getMenus() {
    return request.get<ServerMenuItem[]>('/api/system/menus')
  },

  /**
   * 获取菜单详情
   * @param id 菜单ID
   */
  getMenuDetail(id: number) {
    return request.get<ServerMenuItem>(`/api/system/menus/${id}`)
  },

  /**
   * 创建菜单
   * @param data 菜单数据
   */
  createMenu(data: Partial<ServerMenuItem>) {
    return request.post<ServerMenuItem>('/api/system/menus', data)
  },

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param data 菜单数据
   */
  updateMenu(id: number, data: Partial<ServerMenuItem>) {
    return request.put<ServerMenuItem>(`/api/system/menus/${id}`, data)
  },

  /**
   * 删除菜单
   * @param id 菜单ID
   */
  deleteMenu(id: number) {
    return request.delete<null>(`/api/system/menus/${id}`)
  },
}

/**
 * 部门管理相关API
 */
export const deptApi = {
  /**
   * 获取部门列表
   */
  getDepts() {
    return request.get<DeptItem[]>('/api/system/depts')
  },

  /**
   * 获取部门详情
   * @param id 部门ID
   */
  getDeptDetail(id: number) {
    return request.get<DeptItem>(`/api/system/depts/${id}`)
  },

  /**
   * 创建部门
   * @param data 部门数据
   */
  createDept(data: Partial<DeptItem>) {
    return request.post<DeptItem>('/api/system/depts', data)
  },

  /**
   * 更新部门
   * @param id 部门ID
   * @param data 部门数据
   */
  updateDept(id: number, data: Partial<DeptItem>) {
    return request.put<DeptItem>(`/api/system/depts/${id}`, data)
  },

  /**
   * 删除部门
   * @param id 部门ID
   */
  deleteDept(id: number) {
    return request.delete<null>(`/api/system/depts/${id}`)
  },
}
