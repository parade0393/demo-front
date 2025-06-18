// 公共接口
import request from '@/utils/request'

// 上传文件
export const uploadFileApi = (data: FormData) => {
  return request.upload(data)
}
