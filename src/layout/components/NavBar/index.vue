<script lang="ts" setup>
import { inject, ref } from 'vue'
import BreadCrumb from './components/BreadCrumb.vue'
import SettingsDrawer from '../SettingsDrawer/index.vue'
import Logo from '../Logo/index.vue'
import AppMenu from '@/components/AppMenu/index.vue'
import { menuItems } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'
const emit = defineEmits(['toggle-side-bar'])

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse')
const toggleSideBar = () => {
  // 触发父组件的toggleSideBar事件
  emit('toggle-side-bar')
}

// 使用菜单hooks获取相关数据和方法
const { layoutMode, primaryColor, showTopMenu } = useMenu()

// 模拟用户数据
const userInfo = ref({
  name: '管理员',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
})

// 模拟下拉菜单选项
const handleCommand = (command: string) => {
  if (command === 'logout') {
    // 退出登录逻辑
    console.log('退出登录')
  } else if (command === 'profile') {
    // 个人信息逻辑
    console.log('个人信息')
  }
}

// 设置抽屉控制
const settingsVisible = ref(false)

// 打开设置抽屉
const openSettings = () => {
  settingsVisible.value = true
}
</script>

<template>
  <div class="navbar" :class="{ 'with-top-menu': showTopMenu }">
    <div class="navbar__left">
      <!-- 在top-menu模式下显示Logo -->
      <Logo
        v-if="layoutMode === 'top-menu'"
        class="navbar-logo"
        :collapse="false"
        :in-navbar="true"
      />

      <!-- 在非top-menu模式下显示折叠按钮 -->
      <div v-if="layoutMode !== 'top-menu'" class="hamburger-container" @click="toggleSideBar">
        <el-icon :size="20">
          <Fold v-if="isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>

      <!-- 在非顶部菜单模式且非混合模式下显示面包屑 -->
      <BreadCrumb
        v-if="layoutMode !== 'top-menu' && layoutMode !== 'mixed'"
        class="breadcrumb-container"
      />

      <!-- 顶部菜单 -->
      <div v-if="showTopMenu" class="top-menu-container">
        <AppMenu
          :menu-items="menuItems"
          :active-text-color="primaryColor"
          mode="horizontal"
          background-color="transparent"
          text-color="#303133"
          :show-sub-menu="false"
        />
      </div>
    </div>
    <div class="navbar__right">
      <div class="right-menu">
        <!-- 设置图标 -->
        <div class="settings-container" @click="openSettings">
          <el-tooltip content="系统设置" placement="bottom">
            <el-icon :size="20"><Setting /></el-icon>
          </el-tooltip>
        </div>

        <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <el-avatar :size="30" :src="userInfo.avatar" />
            <span class="user-name">{{ userInfo.name }}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><user /></el-icon>
                个人信息
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><switch-button /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>

  <!-- 设置抽屉 -->
  <SettingsDrawer v-model:visible="settingsVisible" />
</template>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: visible; /* 修改为visible，确保下拉菜单可见 */
  position: relative;
  background: var(--el-bg-color);
  box-shadow: 0 1px 4px var(--el-mask-color-extra-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  z-index: 1002; /* 确保顶部菜单在侧边栏之上 */

  &.with-top-menu {
    height: 60px;
    padding: 0;

    .navbar__left {
      display: flex;
      align-items: center;
      height: 100%;
      flex: 1;
    }

    .top-menu-container {
      height: 100%;
      flex: 1;

      :deep(.el-menu) {
        border-bottom: none;
        height: 100%;

        .el-menu-item {
          height: 60px;
          line-height: 60px;
        }
      }
    }
  }

  .navbar-logo {
    height: 60px;
    background: transparent;
    padding: 0 15px;

    :deep(.logo-container) {
      background: transparent;

      .logo-title {
        color: var(--el-text-color-primary);
      }
    }
  }

  .navbar__left {
    display: flex;
    align-items: center;

    .hamburger-container {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background 0.3s;
      padding: 0 10px;
      color: var(--el-text-color-regular);

      &:hover {
        background: var(--el-mask-color-extra-light);
      }
    }

    .breadcrumb-container {
      float: left;
      margin-left: 15px;
    }
  }

  .navbar__right {
    display: flex;
    align-items: center;

    .right-menu {
      float: right;
      height: 100%;
      display: flex;
      align-items: center;

      .settings-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 0 15px;
        cursor: pointer;
        color: var(--el-text-color-regular);
        transition: all 0.3s;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .avatar-container {
        cursor: pointer;
        margin-left: 10px;

        .avatar-wrapper {
          display: flex;
          align-items: center;

          .user-name {
            margin: 0 5px;
            color: var(--el-text-color-regular);
          }
        }
      }
    }
  }
}
</style>
