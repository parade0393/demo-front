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

/**
 * 通用分页结果结构
 * @template T 列表项类型
 */
interface PageResult<T = unknown> {
  /** 记录列表 */
  records: T[]
  /** 总记录数 */
  total: number
  /** 每页记录数 */
  size: number
  /** 当前页码 */
  current: number
  /** 总页数 */
  pages: number
}

/**
 * 通用分页查询参数
 */
interface PageQueryParams {
  /** 页码 */
  current?: number
  /** 每页记录数 */
  size?: number
}
