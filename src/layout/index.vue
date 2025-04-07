<script lang="ts" setup>
import { ref, provide, computed } from 'vue'
// import { useRouter } from 'vue-router'
import AppMain from './components/AppMain/index.vue'
import NavBar from './components/NavBar/index.vue'
import SideBar from './components/SideBar/index.vue'
import TagsView from './components/TagsView/index.vue'
import { useConfigStore } from '@/stores/config'

// const router = useRouter()

// 获取配置信息
const configStore = useConfigStore()
const layoutMode = computed(() => configStore.config.layout.layoutMode)

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
  <div class="app-wrapper" :class="`layout-${layoutMode}`">
    <!-- 左侧菜单布局 -->
    <template v-if="layoutMode === 'left-sidebar'">
      <el-container class="main-container">
        <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
          <SideBar />
        </el-aside>
        <el-container class="main-content" :class="{ collapsed: isCollapse }">
          <el-header :class="[layoutMode]" height="50px" class="main-header">
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
    </template>

    <!-- 右侧菜单布局 -->
    <template v-else-if="layoutMode === 'right-sidebar'">
      <el-container class="main-container">
        <el-container class="main-content right-mode" :class="{ collapsed: isCollapse }">
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
        <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container right">
          <SideBar />
        </el-aside>
      </el-container>
    </template>

    <!-- 顶部菜单布局 -->
    <template v-else-if="layoutMode === 'top-menu'">
      <el-container class="main-container">
        <el-header height="60px" class="main-header">
          <NavBar />
        </el-header>
        <el-header height="34px" class="tags-view-header">
          <TagsView />
        </el-header>
        <el-main class="app-main-container">
          <AppMain />
        </el-main>
      </el-container>
    </template>

    <!-- 混合布局（顶部+侧边） -->
    <template v-else-if="layoutMode === 'mixed'">
      <el-container class="main-container">
        <el-header height="60px" class="main-header">
          <NavBar @toggle-side-bar="toggleSideBar" />
        </el-header>
        <el-container>
          <el-aside :width="isCollapse ? '64px' : '210px'" class="sidebar-container">
            <SideBar />
          </el-aside>
          <el-container class="main-content" :class="{ collapsed: isCollapse }">
            <el-header height="34px" class="tags-view-header">
              <TagsView />
            </el-header>
            <el-main class="app-main-container">
              <AppMain />
            </el-main>
          </el-container>
        </el-container>
      </el-container>
    </template>
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

      &.right {
        left: auto;
        right: 0;
      }
    }

    .main-content {
      margin-left: 210px;
      position: relative;
      height: 100%;
      overflow: hidden;
      transition:
        margin-left 0.28s,
        margin-right 0.28s;

      &.collapsed {
        margin-left: 64px;
      }

      &.right-mode {
        margin-left: 0;
        margin-right: 210px;

        &.collapsed {
          margin-left: 0;
          margin-right: 64px;
        }
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

  // 顶部菜单布局
  &.layout-top-menu {
    .main-container {
      .main-header {
        padding: 0;
      }
      .tags-view-header {
        padding: 0;
      }
      .app-main-container {
        height: calc(100% - 94px);
      }
    }
  }

  // 混合布局
  &.layout-mixed {
    .main-container {
      .main-header {
        padding: 0;
      }

      .main-content {
        margin-left: 210px;
        height: calc(100% - 60px);

        &.collapsed {
          margin-left: 64px;
        }

        .app-main-container {
          height: calc(100% - 34px);
        }
      }
    }
  }
}
</style>
