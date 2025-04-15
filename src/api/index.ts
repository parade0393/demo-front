/**
 * API模块
 * 基于封装的axios实例，提供具体的API调用方法
 * 采用模块化结构，便于维护和扩展
 */

// 导入各模块API
import userApi from './modules/user'
import { userApi as systemUserApi, roleApi, menuApi, deptApi } from './modules/system'
import { articleApi, categoryApi } from './modules/content'

// 导出所有API
export {
  // 用户相关
  userApi,

  // 系统管理相关
  systemUserApi,
  roleApi,
  menuApi,
  deptApi,

  // 内容管理相关
  articleApi,
  categoryApi,
}

// 导出类型
export type { LoginParams, LoginResult, ServerMenuItem } from './modules/user'
export type { PaginationParams, PaginationResult } from './modules/system'
export type { Article, Category } from './modules/content'
