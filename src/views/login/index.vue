<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { authApi } from '@/api'
import { usePermissionStore } from '@/stores/permission'
import type { LoginParams } from '@/api/modules/system/auth'

// 获取路由实例
const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

// 登录表单
const loginForm = reactive<LoginParams>({
  username: '',
  password: '',
})

// 表单校验规则
const loginRules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
  ],
})

// 表单引用
const loginFormRef = ref<FormInstance>()

// 记住密码
const rememberMe = ref(false)

// 登录加载状态
const loading = ref(false)

// 登录方法
const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 调用登录接口
        const loginRes = await authApi.login(loginForm)
        // 保存Token
        permissionStore.setToken(loginRes.token)

        // 获取用户信息
        const userInfoRes = await authApi.getUserInfo()
        permissionStore.setUserInfo(userInfoRes)

        //下面这行代码优化一下,需要考虑异常路由的情况
        const redirectPath = handleRedirect(route.query)
        router.push(redirectPath)
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('登录失败:', error.message)
        } else {
          console.error('登录失败:', error)
        }
      } finally {
        loading.value = false
      }
    }
  })
}

function handleRedirect(query: LocationQuery): RouteLocationRaw {
  // 默认跳转路径
  const defaultPath = '/'

  // 获取原始重定向路径
  const rawRedirect = (query.redirect as string) || defaultPath

  try {
    // 使用Vue Router解析路径
    const resolved = router.resolve(rawRedirect)
    return {
      path: resolved.path,
      query: resolved.query,
    }
  } catch {
    // 异常处理：返回安全路径
    return { path: defaultPath }
  }
}

// 提供测试账号信息
const useTestAccount = (type: 'admin' | 'test') => {
  if (type === 'admin') {
    loginForm.username = 'admin'
    loginForm.password = '123456'
  } else {
    loginForm.username = 'test'
    loginForm.password = '123456'
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>系统登录</h2>
        <p>欢迎使用中后台管理系统</p>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="top"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
            autocomplete="on"
            @keyup.enter="handleLogin(loginFormRef)"
          />
        </el-form-item>

        <div class="login-options">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary">忘记密码?</el-link>
        </div>

        <el-button
          :loading="loading"
          type="primary"
          class="login-button"
          @click="handleLogin(loginFormRef)"
        >
          登录
        </el-button>

        <div class="test-accounts">
          <p>测试账号:</p>
          <el-button type="info" link @click="useTestAccount('admin')">管理员账号</el-button>
          <el-button type="info" link @click="useTestAccount('test')">测试账号</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
  background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .login-card {
    width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        font-size: 24px;
        color: #303133;
        margin-bottom: 10px;
      }

      p {
        font-size: 14px;
        color: #909399;
      }
    }

    .login-form {
      .login-options {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .login-button {
        width: 100%;
        margin-bottom: 20px;
      }

      .test-accounts {
        text-align: center;
        margin-top: 20px;
        color: #909399;
        font-size: 14px;

        p {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
