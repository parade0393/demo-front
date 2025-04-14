/**
 * API模块
 * 基于封装的axios实例，提供具体的API调用方法
 */
import request from '@/utils/request'
import type { UserInfo, Article } from '@/mocks'
import type { ApiResponse } from '@/utils/request'

/**
 * 登录参数
 */
export interface LoginParams {
  username: string
  password: string
  [key: string]: unknown
}

/**
 * 登录响应
 */
export interface LoginResult {
  token: string
  user: UserInfo
}

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
 * 用户相关API
 */
export const userApi = {
  /**
   * 用户登录
   * @param params 登录参数
   * @returns 登录结果
   */
  login(params: LoginParams) {
    return request.post<LoginResult>('/api/login', params, {
      showLoading: true,
    })
  },

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo() {
    return request.get<UserInfo>('/api/user/info')
  },
}

/**
 * 文章相关API
 */
export const articleApi = {
  /**
   * 获取文章列表
   * @param params 分页参数
   * @returns 文章列表
   */
  getArticles(params: PaginationParams) {
    return request.get<PaginationResult<Article>>('/api/articles', params)
  },

  /**
   * 获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  getArticleDetail(id: number) {
    return request.get<Article>(`/api/articles/${id}`)
  },

  /**
   * 创建文章
   * @param data 文章数据
   * @returns 创建的文章
   */
  createArticle(data: Partial<Article>) {
    return request.post<Article>('/api/articles', data, {
      showLoading: true,
      // 示例：自定义headers
      customHeaders: {
        'X-Custom-Header': 'custom-value',
      },
    })
  },

  /**
   * 获取完整响应示例
   * 演示如何获取完整的响应结构而不仅是data部分
   * @param id 文章ID
   * @returns 完整的响应结构
   */
  getArticleWithFullResponse(id: number) {
    return request.get<Article, ApiResponse<Article>>(
      `/api/articles/${id}`,
      {},
      {
        returnData: false, // 设置为false，返回完整响应结构
      },
    )
  },
}

// 导出所有API
export default {
  user: userApi,
  article: articleApi,
}
