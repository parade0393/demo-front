<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadProps } from 'element-plus'
import { buildAuthHeaders } from '@/utils/request'
defineOptions({
  name: 'RouteParamsDemo',
})

const computedStr = computed(() => {
  const query = useRoute().query || {}
  return Object.keys(query).length > 0 ? `路由参数: ${JSON.stringify(query)}` : '无路由参数'
})

// 文件预览
const handlePreview: UploadProps['onPreview'] = (file) => {
  console.log(file)
}

// 文件移除
const handleRemove: UploadProps['onRemove'] = (file, fileList) => {
  console.log(file, fileList)
}

// 文件移除前的确认
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  return ElMessageBox.confirm(`Cancel the transfer of ${uploadFile.name} ?`).then(
    () => true,
    () => false,
  )
}

// 超出上传限制
const handleExceed: UploadProps['onExceed'] = (files, uploadFiles) => {
  ElMessage.warning(
    `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
      files.length + uploadFiles.length
    } 个文件`,
  )
}

// 上传成功回调
const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile, uploadFiles) => {
  ElMessage.success('上传成功')
  console.log(response, uploadFile, uploadFiles)
}

// 上传失败回调
const handleError: UploadProps['onError'] = (error, uploadFile, uploadFiles) => {
  ElMessage.error('上传失败')
  console.error(error, uploadFile, uploadFiles)
}
</script>

<template>
  <div>{{ computedStr }}</div>
  <el-upload
    class="upload-demo"
    action="http://localhost:8080/api/upload/single"
    :headers="buildAuthHeaders()"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    multiple
    :limit="3"
    :on-exceed="handleExceed"
    :on-success="handleSuccess"
    :on-error="handleError"
  >
    <el-button type="primary">点击上传</el-button>
    <template #tip>
      <div class="el-upload__tip">支持jpg/png文件，且不超过500kb</div>
    </template>
  </el-upload>
</template>

<style lang="scss" scoped>
.upload-demo {
  margin: 20px;
}
.el-upload__tip {
  color: #666;
  font-size: 12px;
  margin-top: 7px;
}
</style>
