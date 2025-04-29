import request from '@/utils/request'
export const menuApi = {
  fetchUserMenuListApi() {
    return request.get('/api/menu/list')
  },
}
