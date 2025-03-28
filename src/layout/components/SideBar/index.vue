<script lang="ts" setup>
import { ref, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse', ref(false))

// 模拟菜单数据
const menuItems = ref([
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'Odometer',
  },
  {
    path: '/system',
    name: '系统管理',
    icon: 'Setting',
    children: [
      {
        path: '/system/user',
        name: '用户管理',
        icon: 'User',
      },
      {
        path: '/system/role',
        name: '角色管理',
        icon: 'UserFilled',
      },
    ],
  },
  {
    path: '/content',
    name: '内容管理',
    icon: 'Document',
    children: [
      {
        path: '/content/article',
        name: '文章管理',
        icon: 'Tickets',
      },
      {
        path: '/content/category',
        name: '分类管理',
        icon: 'Files',
      },
    ],
  },
])

const router = useRouter()
const currentRoute = useRoute()

const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="sidebar">
    <div class="logo-container">
      <h1 class="logo-title">Admin System</h1>
    </div>
    <el-menu
      :default-active="currentRoute.path"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <template v-for="item in menuItems" :key="item.path">
        <el-sub-menu v-if="item.children && item.children.length > 0" :index="item.path">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
            @click="handleMenuClick(child.path)"
          >
            <el-icon v-if="child.icon">
              <component :is="child.icon" />
            </el-icon>
            <span>{{ child.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path" @click="handleMenuClick(item.path)">
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color: #304156;

  .logo-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2b3649;

    .logo-title {
      color: #fff;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .sidebar-menu {
    border-right: none;
    width: 100%;
  }
}
</style>
