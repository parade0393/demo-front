/**
 * API模块
 * 采用模块化结构，便于维护和扩展
 */

// 导入各模块API
import authApi from './modules/system/auth'
import { menuApi } from './modules/system/menu'
import { roleApi } from './modules/system/role'
import { deptApi } from './modules/system/dept'
import { userApi } from './modules/system/user'

// 导出所有API
export {
  // 认证相关
  authApi,
  menuApi,
  roleApi,
  deptApi,
  userApi,
}

// 导出类型
export type { LoginParams, LoginResult, ServerMenuItem } from './modules/system/auth'
export type { RoleItem } from './modules/system/role'
export type { DeptItem } from './modules/system/dept'
export type { UserItem, UserPageResult, UserQueryParams } from './modules/system/user'
