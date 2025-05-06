/**
 * 接口响应通用格式
 * @template T 响应数据类型
 */
interface ApiResponse<T = unknown> {
  /** 响应数据 */
  data: T
  /** 错误码，200表示成功，其他表示失败 */
  code: number
  /** 错误信息 */
  message: string
}
