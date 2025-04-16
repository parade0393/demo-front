import { setupMSW } from '@/mocks'

export async function setupMock(): Promise<void> {
  const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

  if (enableMock) {
    try {
      await setupMSW()
      console.log('已启用API模拟服务')
    } catch (error) {
      console.error('初始化Mock服务失败:', error)
    }
  }
}
