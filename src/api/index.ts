/**
 * API模块
 * 采用模块化结构，便于维护和扩展
 */

// 导入各模块API
import authApi from './modules/system/auth'

// 导出所有API
export {
  // 认证相关
  authApi,
}

// 导出类型
export type { LoginParams, LoginResult, ServerMenuItem } from './modules/system/auth'
