<script lang="ts" setup>
import { inject, ref } from 'vue'
import BreadCrumb from './components/BreadCrumb.vue'
import SettingsDrawer from '../SettingsDrawer/index.vue'
const emit = defineEmits(['toggle-side-bar'])

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse')
const toggleSideBar = () => {
  // 触发父组件的toggleSideBar事件
  emit('toggle-side-bar')
}

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
  <div class="navbar">
    <div class="navbar__left">
      <div class="hamburger-container" @click="toggleSideBar">
        <el-icon :size="20">
          <Fold v-if="isCollapse" />
          <Expand v-else />
        </el-icon>
      </div>
      <BreadCrumb class="breadcrumb-container" />
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
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;

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

      &:hover {
        background: rgba(0, 0, 0, 0.025);
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
        color: #606266;
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
          }
        }
      }
    }
  }
}
</style>
