/**
 * 内容管理相关API
 */
import request from '@/utils/request'
import type { PaginationParams, PaginationResult } from './system'

/**
 * 文章接口
 */
export interface Article {
  id: number
  title: string
  content: string
  author: string
  createTime: string
  categoryId?: number
  categoryName?: string
  tags?: string[]
}

/**
 * 分类接口
 */
export interface Category {
  id: number
  name: string
  description?: string
  parentId?: number
  createTime: string
}

/**
 * 文章管理相关API
 */
export const articleApi = {
  /**
   * 获取文章列表
   * @param params 分页参数
   * @returns 文章列表
   */
  getArticles(params: PaginationParams) {
    return request.get<PaginationResult<Article>>('/api/content/articles', params)
  },

  /**
   * 获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  getArticleDetail(id: number) {
    return request.get<Article>(`/api/content/articles/${id}`)
  },

  /**
   * 创建文章
   * @param data 文章数据
   * @returns 创建的文章
   */
  createArticle(data: Partial<Article>) {
    return request.post<Article>('/api/content/articles', data, {
      showLoading: true,
    })
  },

  /**
   * 更新文章
   * @param id 文章ID
   * @param data 文章数据
   * @returns 更新的文章
   */
  updateArticle(id: number, data: Partial<Article>) {
    return request.put<Article>(`/api/content/articles/${id}`, data, {
      showLoading: true,
    })
  },

  /**
   * 删除文章
   * @param id 文章ID
   */
  deleteArticle(id: number) {
    return request.delete<null>(`/api/content/articles/${id}`, {
      showLoading: true,
    })
  },
}

/**
 * 分类管理相关API
 */
export const categoryApi = {
  /**
   * 获取分类列表
   * @param params 分页参数
   * @returns 分类列表
   */
  getCategories(params?: PaginationParams) {
    return request.get<PaginationResult<Category> | Category[]>('/api/content/categories', params)
  },

  /**
   * 获取分类详情
   * @param id 分类ID
   * @returns 分类详情
   */
  getCategoryDetail(id: number) {
    return request.get<Category>(`/api/content/categories/${id}`)
  },

  /**
   * 创建分类
   * @param data 分类数据
   * @returns 创建的分类
   */
  createCategory(data: Partial<Category>) {
    return request.post<Category>('/api/content/categories', data, {
      showLoading: true,
    })
  },

  /**
   * 更新分类
   * @param id 分类ID
   * @param data 分类数据
   * @returns 更新的分类
   */
  updateCategory(id: number, data: Partial<Category>) {
    return request.put<Category>(`/api/content/categories/${id}`, data, {
      showLoading: true,
    })
  },

  /**
   * 删除分类
   * @param id 分类ID
   */
  deleteCategory(id: number) {
    return request.delete<null>(`/api/content/categories/${id}`, {
      showLoading: true,
    })
  },
}
