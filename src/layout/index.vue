<script lang="ts" setup>
import { ref, provide } from 'vue'
// import { useRouter } from 'vue-router'
import AppMain from './components/AppMain/index.vue'
import NavBar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
import TagsView from './components/TagsView/index.vue'

// const router = useRouter()

// 侧边栏折叠状态
const isCollapse = ref(false)
provide('isCollapse', isCollapse)

// 用于刷新视图的key
const refreshViewKey = ref(0)

// 提供刷新视图的方法
const refreshView = () => {
  // 增加key值，强制重新渲染组件
  refreshViewKey.value += 1
}

// 提供刷新方法和key给子组件使用
provide('refreshView', refreshView)
provide('refreshViewKey', refreshViewKey)

const toggleSideBar = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="app-wrapper">
    <el-container class="main-container">
      <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
        <SideBar />
      </el-aside>
      <el-container class="main-content" :class="{ collapsed: isCollapse }">
        <el-header height="50px" class="main-header">
          <NavBar @toggle-side-bar="toggleSideBar" />
        </el-header>
        <el-header height="34px" class="tags-view-header">
          <TagsView />
        </el-header>
        <el-main class="app-main-container">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  .main-container {
    height: 100%;
    width: 100%;

    .sidebar-container {
      transition: width 0.28s;
      height: 100%;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
    }

    .main-content {
      margin-left: 210px;
      position: relative;
      height: 100%;
      overflow: hidden;
      transition: margin-left 0.28s;

      &.collapsed {
        margin-left: 64px;
      }

      .main-header {
        padding: 0;
      }

      .tags-view-header {
        padding: 0;
      }

      .app-main-container {
        padding: 0;
        height: calc(100% - 84px);
        overflow: hidden;
      }
    }
  }
}
</style>
