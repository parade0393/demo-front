<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { LocationQuery, RouteLocationRaw } from 'vue-router'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { authApi } from '@/api'
import { usePermissionStore } from '@/stores/permission'
import type { LoginParams } from '@/api'

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
        permissionStore.setRefreshToken(loginRes.refreshToken)

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
    <div class="login-content">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <h1 class="brand-title">Trae Admin</h1>
          <p class="brand-desc">新一代中后台管理系统解决方案</p>
          <div class="decoration">
            <div class="circle-1"></div>
            <div class="circle-2"></div>
            <div class="circle-3"></div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <div class="login-box">
          <div class="login-header">
            <h2>欢迎回来</h2>
            <p>请使用您的账号密码登录系统</p>
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
                class="custom-input"
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
                class="custom-input"
              />
            </el-form-item>

            <div class="login-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-link type="primary" class="forget-link">忘记密码?</el-link>
            </div>

            <el-button
              :loading="loading"
              type="primary"
              class="login-button"
              @click="handleLogin(loginFormRef)"
            >
              <span class="button-text">登 录</span>
            </el-button>

            <div class="test-accounts">
              <p>测试账号快捷登录</p>
              <div class="account-buttons">
                <el-button type="info" link @click="useTestAccount('admin')">
                  <el-icon><User /></el-icon> 管理员账号
                </el-button>
                <el-button type="info" link @click="useTestAccount('test')">
                  <el-icon><User /></el-icon> 测试账号
                </el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .login-content {
    display: flex;
    width: 1000px;
    height: 600px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    animation: fadeIn 0.8s ease-out;

    .brand-section {
      flex: 1;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      position: relative;
      overflow: hidden;

      .brand-content {
        position: relative;
        z-index: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: white;
        padding: 0 20px;

        .brand-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 20px;
          animation: slideUp 0.8s ease-out;
        }

        .brand-desc {
          font-size: 18px;
          opacity: 0.9;
          line-height: 1.6;
          animation: slideUp 0.8s ease-out 0.2s;
        }
      }

      .decoration {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .circle-1,
        .circle-2,
        .circle-3 {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation: float 6s ease-in-out infinite;
        }

        .circle-2 {
          width: 200px;
          height: 200px;
          bottom: -50px;
          left: -50px;
          animation: float 8s ease-in-out infinite;
        }

        .circle-3 {
          width: 100px;
          height: 100px;
          bottom: 50px;
          right: 50px;
          animation: float 4s ease-in-out infinite;
        }
      }
    }

    .login-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;

      .login-box {
        width: 100%;
        max-width: 400px;

        .login-header {
          text-align: center;
          margin-bottom: 40px;

          h2 {
            font-size: 28px;
            color: #303133;
            margin-bottom: 10px;
            font-weight: 600;
          }

          p {
            font-size: 16px;
            color: #606266;
          }
        }

        .login-form {
          .custom-input {
            :deep(.el-input__wrapper) {
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              border-radius: 8px;
              padding: 4px 12px;
              transition: all 0.3s ease;

              &:hover,
              &.is-focus {
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
              }
            }
          }

          .login-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;

            .forget-link {
              font-size: 14px;
              transition: all 0.3s ease;

              &:hover {
                color: #764ba2;
              }
            }
          }

          .login-button {
            width: 100%;
            height: 44px;
            border-radius: 8px;
            font-size: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            margin-bottom: 30px;
            transition: all 0.3s ease;

            .button-text {
              letter-spacing: 4px;
            }

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            }
          }

          .test-accounts {
            text-align: center;
            padding-top: 20px;
            border-top: 1px dashed #e4e7ed;

            p {
              color: #606266;
              margin-bottom: 15px;
              font-size: 14px;
            }

            .account-buttons {
              display: flex;
              justify-content: center;
              gap: 20px;

              .el-button {
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s ease;

                &:hover {
                  color: #764ba2;
                  transform: translateY(-2px);
                }
              }
            }
          }
        }
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

// 移动端适配
@media (max-width: 768px) {
  .login-container {
    background: #f0f2f5; // 移动端使用更简洁的背景色
  }
  .login-container .login-content {
    // 提高选择器特异性
    flex-direction: column;
    width: 100%;
    height: 100vh; // 明确设置为100vh以适应全屏设计
    border-radius: 0;
    box-shadow: none;
    background: #f0f2f5; // 移动端背景与容器一致
    margin: 0;
    padding: 0;

    .brand-section {
      // 在移动端，品牌区域可以简化为一个顶部Header
      flex: 0 0 auto; // 不占据flex空间，固定高度
      height: 160px; // 减小品牌区高度，为表单区腾出空间
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); // 保留渐变背景

      .brand-content {
        padding: 0;
        .brand-title {
          font-size: 28px; // 调整字体大小
          margin-bottom: 10px;
        }
        .brand-desc {
          font-size: 14px; // 调整字体大小
          opacity: 0.8;
        }
      }
      .decoration {
        display: none; // 移除装饰圆点，简化视觉
      }
    }

    .login-section {
      flex: 1; // 登录区域占据剩余空间
      padding: 15px 20px; // 调整垂直内边距，优化空间
      background-color: #ffffff; // 登录表单区域使用白色背景
      // border-top-left-radius: 20px; // 移除圆角效果
      // border-top-right-radius: 20px;
      // margin-top: -20px; // 移除上移效果
      // box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.05); // 移除阴影
      // overflow-y: auto; // 内容过多时允许滚动

      .login-box {
        max-width: 100%;
        .login-header {
          margin-bottom: 15px; // 减少间距
          h2 {
            font-size: 22px;
            color: #333;
          }
          p {
            font-size: 14px;
            color: #666;
          }
        }

        .login-form {
          .el-form-item {
            margin-bottom: 15px; // 减少表单项间距
          }
          .custom-input {
            :deep(.el-input__wrapper) {
              padding: 6px 15px; // 调整输入框内边距
            }
          }
          .login-options {
            margin: 10px 0; // 减少间距
            .el-checkbox__label {
              font-size: 13px;
            }
            .forget-link {
              font-size: 13px;
            }
          }
          .login-button {
            height: 42px;
            font-size: 15px;
            margin-bottom: 15px; // 减少间距
            letter-spacing: 2px;
          }
          .test-accounts {
            margin-top: 15px; // 减少间距
            padding-top: 10px; // 减少间距
            p {
              font-size: 13px;
              margin-bottom: 10px; // 减少间距
            }
            .account-buttons {
              flex-direction: row; // 测试账号按钮横向排列
              justify-content: space-around; // 分散对齐
              gap: 10px;
              .el-button {
                font-size: 13px;
                .el-icon {
                  font-size: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .login-content {
    .brand-section {
      height: 160px; // 进一步减小品牌区高度
      .brand-content {
        .brand-title {
          font-size: 24px;
        }
        .brand-desc {
          font-size: 13px;
        }
      }
    }
    .login-section {
      padding: 25px 15px; // 调整内边距
      .login-box {
        .login-header {
          margin-bottom: 20px;
          h2 {
            font-size: 20px;
          }
        }
        .login-form {
          .login-options {
            // 在非常小的屏幕上，选项可以考虑堆叠
            // flex-direction: column;
            // align-items: flex-start;
            // gap: 8px;
          }
          .test-accounts {
            .account-buttons {
              flex-direction: column; // 更小屏幕上测试账号按钮垂直排列
              gap: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
