import type { App } from 'vue'
import router from '@/router'
import '@/router/permission'

export function setupRouter(app: App): void {
  app.use(router)
}
