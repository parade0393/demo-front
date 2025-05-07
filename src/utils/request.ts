/**
 * axios请求封装
 * 支持泛型返回、统一错误处理、自定义headers、loading控制等功能
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

import { usePermissionStore } from '@/stores/permission'
import type { LoginResult } from '@/api/modules/system/auth'

/**
 * 扩展的请求配置
 */
export interface RequestOptions extends AxiosRequestConfig {
  /** 是否显示loading，默认false */
  showLoading?: boolean
  /** 是否直接返回data，默认true */
  returnData?: boolean
  /** 自定义headers */
  customHeaders?: Record<string, string>
}

/**
 * 默认配置
 */
const defaultConfig: RequestOptions = {
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  showLoading: false,
  returnData: true,
}

/**
 * 获取系统版本号
 */
const getSystemVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0'
}

const getUserToken = (): string => {
  const permissionStore = usePermissionStore()
  return permissionStore.getToken() || ''
}

const getRefreshToken = (): string => {
  const permissionStore = usePermissionStore()
  return permissionStore.getRefreshToken() || ''
}

/**
 * 请求类
 */
class Request {
  private instance: AxiosInstance
  private loadingInstance: LoadingInstance | null = null
  private isRefreshing = false
  private requests: Array<(token: string) => void> = []

  constructor(config: RequestOptions) {
    // 创建axios实例
    this.instance = axios.create(config)

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const requestOptions = config as RequestOptions

        // 添加系统版本号到header
        config.headers['X-System-Version'] = getSystemVersion()
        const userToken = getUserToken()
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`
        } else {
          delete config.headers.Authorization
        }

        // 添加自定义headers
        if (requestOptions.customHeaders) {
          Object.keys(requestOptions.customHeaders).forEach((key) => {
            config.headers[key] = requestOptions.customHeaders![key]
          })
        }

        // 显示loading
        if (requestOptions.showLoading) {
          this.loadingInstance = ElLoading.service({
            lock: true,
            text: '加载中...',
            background: 'rgba(0, 0, 0, 0.7)',
          })
        }
        return config
      },
      (error: unknown) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => {
        // 关闭loading
        if (this.loadingInstance) {
          this.loadingInstance.close()
        }

        const { data } = response
        const requestOptions = response.config as RequestOptions
        // 判断是否成功
        if (data.code !== 200) {
          // 显示错误信息
          ElMessage.error(data.errorMsg || '请求失败')
          return Promise.reject(data)
        }

        // 根据配置返回data或完整响应
        return requestOptions.returnData ? data.data : data
      },
      async (error: unknown) => {
        // 关闭loading
        if (this.loadingInstance) {
          this.loadingInstance.close()
        }

        // 处理错误
        let message = '网络请求失败'
        const axiosError = error as AxiosError
        const originalRequest = axiosError.config

        const errorMsg = (axiosError.response?.data as ApiResponse)?.message

        if (axiosError.response) {
          // 处理401错误（token过期）
          if (axiosError.response.status === 401 && originalRequest) {
            const permissionStore = usePermissionStore()
            const userInfo = permissionStore.userInfo

            // 确保用户已登录且有用户信息
            if (userInfo) {
              return this.handleTokenRefresh(originalRequest)
            } else {
              message = '未授权，请重新登录'
            }
          } else {
            switch (axiosError.response.status) {
              case 403:
                message = errorMsg || '拒绝访问'
                break
              case 404:
                message = errorMsg || '请求地址错误'
                break
              case 500:
                message = errorMsg || '服务器内部错误'
                break
              default:
                message = errorMsg || `请求失败(${axiosError.response.status})`
            }
          }
        } else if (axiosError.message && axiosError.message.includes('timeout')) {
          message = '请求超时'
        }

        ElMessage.error(message)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 发送请求
   * @param config 请求配置
   * @returns Promise
   */
  public request<T = unknown, R = ApiResponse<T>>(config: RequestOptions): Promise<R> {
    return this.instance.request(config)
  }

  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数
   * @param options 请求配置
   * @returns Promise
   */
  public get<T>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T> {
    return this.instance.get(url, { params, ...options })
  }

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param params 请求参数
   * @param options 请求配置
   * @returns Promise
   */
  public post<T, R = Record<string, unknown>>(
    url: string,
    data?: R,
    params?: R,
    options?: RequestOptions,
  ): Promise<T> {
    return this.instance.post(url, data, { params, ...options })
  }

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param options 请求配置
   * @returns Promise
   */
  public put<T>(url: string, data?: Record<string, unknown>, options?: RequestOptions): Promise<T> {
    return this.instance.put(url, data, options)
  }

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数
   * @param options 请求配置
   * @returns Promise
   */
  public delete<T = unknown, R = T>(
    url: string,
    params?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<R> {
    return this.instance.delete(url, { params, ...options })
  }

  /**
   * 处理token刷新逻辑
   * @param originalRequest 原始请求配置
   * @returns Promise
   */
  private async handleTokenRefresh(originalRequest: AxiosRequestConfig): Promise<unknown> {
    // 如果已经在刷新中，将请求加入队列
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.requests.push((token: string) => {
          // 更新原始请求的token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          resolve(this.instance(originalRequest))
        })
      })
    }

    this.isRefreshing = true

    try {
      // 从localStorage中获取refreshToken
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        throw new Error('No refresh token available')
      }
      // 创建一个新的axios实例来调用刷新token接口，避免循环依赖
      const refreshResponse = await this.post<LoginResult>(
        '/api/auth/refresh',
        {},
        { refreshToken },
      )

      const response = refreshResponse

      // 更新token
      const newToken = response.token
      const permissionStore = usePermissionStore()
      permissionStore.setToken(newToken)
      permissionStore.setRefreshToken(response.refreshToken)

      // 更新原始请求的token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`
      }

      // 执行队列中的请求
      this.requests.forEach((callback) => callback(newToken))
      this.requests = []

      // 重试原始请求
      return this.instance(originalRequest)
    } catch (error) {
      debugger
      // 刷新token失败，清除用户信息并跳转到登录页
      const permissionStore = usePermissionStore()
      permissionStore.resetPermission()
      window.location.href = '/login'
      return Promise.reject(error)
    } finally {
      this.isRefreshing = false
    }
  }
}

// 导出请求实例
export const request = new Request(defaultConfig)

// 导出默认实例
export default request
