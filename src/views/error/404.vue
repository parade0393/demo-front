<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="not-found-image">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0ZM100 180C55.8172 180 20 144.183 20 100C20 55.8172 55.8172 20 100 20C144.183 20 180 55.8172 180 100C180 144.183 144.183 180 100 180Z"
            fill="#E6E8EB"
          />
          <path
            d="M60 80C66.6274 80 72 74.6274 72 68C72 61.3726 66.6274 56 60 56C53.3726 56 48 61.3726 48 68C48 74.6274 53.3726 80 60 80Z"
            fill="#409EFF"
          />
          <path
            d="M140 80C146.627 80 152 74.6274 152 68C152 61.3726 146.627 56 140 56C133.373 56 128 61.3726 128 68C128 74.6274 133.373 80 140 80Z"
            fill="#409EFF"
          />
          <path
            d="M60 140C80 110 120 110 140 140"
            stroke="#E6E8EB"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path
            d="M60 150C80 120 120 120 140 150"
            stroke="#409EFF"
            stroke-width="10"
            stroke-linecap="round"
          />
          <path d="M90 60H110V100H90V60Z" fill="#409EFF" />
          <path d="M90 60H110V100H90V60Z" fill="#409EFF" />
        </svg>
      </div>
      <h1 class="not-found-title">404</h1>
      <p class="not-found-desc">抱歉，您访问的页面不存在</p>
      <div class="not-found-actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;

  .not-found-content {
    text-align: center;

    .not-found-image {
      margin-bottom: 20px;
    }

    .not-found-title {
      font-size: 72px;
      color: #409eff;
      margin: 0;
      line-height: 1;
    }

    .not-found-desc {
      font-size: 20px;
      color: #606266;
      margin: 20px 0 30px;
    }

    .not-found-actions {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
  }
}
</style>
