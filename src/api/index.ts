/**
 * API模块
 * 采用模块化结构，便于维护和扩展
 */

// 导入各模块API
import authApi from './modules/system/auth'
import { menuApi } from './modules/system/menu'

// 导出所有API
export {
  // 认证相关
  authApi,
  menuApi,
}

// 导出类型
export type { LoginParams, LoginResult, ServerMenuItem } from './modules/system/auth'
