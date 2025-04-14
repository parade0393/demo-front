/**
 * MSW (Mock Service Worker) 配置
 * 用于模拟API请求响应，便于前端开发和测试
 */
import { http, HttpResponse, delay } from 'msw'
import { setupWorker } from 'msw/browser'

// 导入API响应类型
import type { ApiResponse } from '@/utils/request'

/**
 * 创建标准响应格式
 * @param data 响应数据
 * @param errorCode 错误码，默认0（成功）
 * @param errorMsg 错误信息
 */
export function createResponse<T>(data: T, errorCode = 0, errorMsg = ''): ApiResponse<T> {
  return {
    data,
    errorCode,
    errorMsg,
  }
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number
  username: string
  email: string
  role: string
}

/**
 * 文章接口
 */
export interface Article {
  id: number
  title: string
  content: string
  author: string
  createTime: string
}

// Mock处理程序
const handlers = [
  // 用户登录
  http.post('/api/login', async ({ request }) => {
    // 模拟网络延迟
    await delay(500)

    const body = (await request.json()) as { username: string; password: string }

    // 模拟登录验证
    if (body.username === 'admin' && body.password === '123456') {
      return HttpResponse.json(
        createResponse({
          token: 'mock-token-123456',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
          },
        }),
      )
    }

    // 登录失败
    return HttpResponse.json(createResponse(null, 1001, '用户名或密码错误'), { status: 200 })
  }),

  // 获取用户信息
  http.get('/api/user/info', () => {
    return HttpResponse.json(
      createResponse<UserInfo>({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
      }),
    )
  }),

  // 获取文章列表
  http.get('/api/articles', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || '1')
    const pageSize = Number(url.searchParams.get('pageSize') || '10')

    // 模拟分页数据
    const articles: Article[] = Array.from({ length: pageSize }).map((_, index) => ({
      id: (page - 1) * pageSize + index + 1,
      title: `文章标题 ${(page - 1) * pageSize + index + 1}`,
      content: `这是文章内容 ${(page - 1) * pageSize + index + 1}`,
      author: 'Admin',
      createTime: new Date().toISOString(),
    }))

    return HttpResponse.json(
      createResponse({
        list: articles,
        total: 100,
        page,
        pageSize,
      }),
    )
  }),

  // 获取文章详情
  http.get('/api/articles/:id', ({ params }) => {
    const id = params.id

    return HttpResponse.json(
      createResponse<Article>({
        id: Number(id),
        title: `文章标题 ${id}`,
        content: `这是文章详细内容 ${id}，包含了更多的信息...`,
        author: 'Admin',
        createTime: new Date().toISOString(),
      }),
    )
  }),

  // 创建文章 - 演示错误处理
  http.post('/api/articles', async ({ request }) => {
    const body = (await request.json()) as Partial<Article>

    // 模拟表单验证失败
    if (!body.title || body.title.length < 5) {
      return HttpResponse.json(createResponse(null, 1002, '标题不能为空且长度不能少于5个字符'), {
        status: 200,
      })
    }

    // 成功创建
    return HttpResponse.json(
      createResponse<Article>({
        id: 101,
        ...(body as Pick<Article, 'title' | 'content'>),
        author: 'Admin',
        createTime: new Date().toISOString(),
      }),
    )
  }),
]

// 创建MSW worker
export const worker = setupWorker(...handlers)

/**
 * 启动MSW
 */
export function setupMSW() {
  // 仅在开发环境启用
  if (import.meta.env.MODE === 'development') {
    worker
      .start({
        onUnhandledRequest: 'bypass', // 对未处理的请求直接放行
        serviceWorker: {
          url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
        },
      })
      .catch(console.error)

    console.log('[MSW] Mock Service Worker 已启动')
  }
}

export default setupMSW
