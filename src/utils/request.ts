/**
 * axios请求封装
 * 支持泛型返回、统一错误处理、自定义headers、loading控制等功能
 */
import type { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import axios from 'axios'
import { ElMessage, ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

import { usePermissionStore } from '@/stores/permission'

/**
 * 接口响应通用格式
 * @template T 响应数据类型
 */
export interface ApiResponse<T = unknown> {
  /** 响应数据 */
  data: T
  /** 错误码，200表示成功，其他表示失败 */
  code: number
  /** 错误信息 */
  errorMsg: string
}

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

/**
 * 请求类
 */
class Request {
  private instance: AxiosInstance
  private loadingInstance: LoadingInstance | null = null

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
      (error: unknown) => {
        // 关闭loading
        if (this.loadingInstance) {
          this.loadingInstance.close()
        }

        // 处理错误
        let message = '网络请求失败'
        const axiosError = error as AxiosError
        if (axiosError.response) {
          switch (axiosError.response.status) {
            case 401:
              message = '未授权，请重新登录'
              break
            case 403:
              message = '拒绝访问'
              break
            case 404:
              message = '请求地址错误'
              break
            case 500:
              message = '服务器内部错误'
              break
            default:
              message = `请求失败(${axiosError.response.status})`
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
   * @param options 请求配置
   * @returns Promise
   */
  public post<T>(
    url: string,
    data?: Record<string, unknown>,
    options?: RequestOptions,
  ): Promise<T> {
    return this.instance.post(url, data, options)
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
}

// 导出请求实例
export const request = new Request(defaultConfig)

// 导出默认实例
export default request
