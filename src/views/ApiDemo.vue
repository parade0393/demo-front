<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi, articleApi } from '@/api'
import type { Article, UserInfo } from '@/mocks'
import type { ApiResponse } from '@/utils/request'

// 用户信息
const userInfo = ref<UserInfo | null>(null)
// 文章列表
const articles = ref<Article[]>([])
// 文章总数
const total = ref(0)
// 当前页码
const currentPage = ref(1)
// 每页条数
const pageSize = ref(10)
// 加载状态
const loading = ref(false)
// 完整响应示例
const fullResponse = ref<ApiResponse<Article> | null>(null)

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    userInfo.value = await userApi.getUserInfo()
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const result = await articleApi.getArticles({
      page: currentPage.value,
      pageSize: pageSize.value,
    })
    articles.value = result.list
    total.value = result.total
  } catch (error) {
    console.error('获取文章列表失败', error)
  } finally {
    loading.value = false
  }
}

// 获取完整响应示例
const fetchFullResponse = async () => {
  try {
    fullResponse.value = await articleApi.getArticleWithFullResponse(1)
  } catch (error) {
    console.error('获取完整响应失败', error)
  }
}

// 创建文章示例 - 成功
const createArticleSuccess = async () => {
  try {
    const result = await articleApi.createArticle({
      title: '这是一个新文章标题（长度超过5个字符）',
      content: '这是文章内容',
    })
    console.log('创建文章成功', result)
    // 刷新文章列表
    fetchArticles()
  } catch (error) {
    console.error('创建文章失败', error)
  }
}

// 创建文章示例 - 失败（标题长度不足）
const createArticleFail = async () => {
  try {
    await articleApi.createArticle({
      title: '短',
      content: '这是文章内容',
    })
  } catch (error) {
    console.error('预期的错误', error)
  }
}

// 页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  fetchArticles()
}

// 登录示例
const login = async () => {
  try {
    const result = await userApi.login({
      username: 'admin',
      password: '123456',
    })
    console.log('登录成功', result)
    // 登录成功后获取用户信息
    fetchUserInfo()
  } catch (error) {
    console.error('登录失败', error)
  }
}

// 登录失败示例
const loginFail = async () => {
  try {
    await userApi.login({
      username: 'admin',
      password: 'wrong-password',
    })
  } catch (error) {
    console.error('预期的登录失败', error)
  }
}

onMounted(() => {
  // 初始化数据
  fetchUserInfo()
  fetchArticles()
  fetchFullResponse()
})
</script>

<template>
  <div class="api-demo">
    <h1>API 和 MSW 示例</h1>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <h2>用户操作</h2>
        </div>
      </template>
      <div class="card-content">
        <div class="user-info" v-if="userInfo">
          <h3>当前用户信息</h3>
          <pre>{{ JSON.stringify(userInfo, null, 2) }}</pre>
        </div>
        <div class="button-group">
          <el-button type="primary" @click="login">登录 (成功示例)</el-button>
          <el-button type="danger" @click="loginFail">登录 (失败示例)</el-button>
        </div>
      </div>
    </el-card>

    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <h2>文章列表</h2>
        </div>
      </template>
      <div class="card-content">
        <div class="button-group">
          <el-button type="success" @click="createArticleSuccess">创建文章 (成功示例)</el-button>
          <el-button type="warning" @click="createArticleFail">创建文章 (失败示例)</el-button>
        </div>

        <el-table :data="articles" style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="title" label="标题" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="total"
            @current-change="handlePageChange"
            layout="prev, pager, next"
          />
        </div>
      </div>
    </el-card>

    <el-card class="demo-card" v-if="fullResponse">
      <template #header>
        <div class="card-header">
          <h2>完整响应结构示例</h2>
        </div>
      </template>
      <div class="card-content">
        <pre>{{ JSON.stringify(fullResponse, null, 2) }}</pre>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.api-demo {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    font-size: 24px;
  }

  .demo-card {
    margin-bottom: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h2 {
        margin: 0;
        font-size: 18px;
      }
    }

    .card-content {
      .user-info {
        margin-bottom: 20px;
      }

      .button-group {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
      }

      pre {
        background-color: #f5f7fa;
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
      }

      .pagination {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
