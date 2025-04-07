<script lang="ts" setup>
import { ref, inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useConfigStore } from '@/stores/config'
import Logo from '../Logo/index.vue'

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse', ref(false))

// 使用配置store获取主题色和布局模式
const configStore = useConfigStore()
const primaryColor = computed(() => configStore.config.theme.primaryColor)
const layoutMode = computed(() => configStore.config.layout.layoutMode)

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

// 当前激活的顶级菜单路径
const activeTopMenu = computed(() => {
  const path = currentRoute.path
  const activeItem = menuItems.value.find(
    (item) =>
      path === item.path || (item.children && item.children.some((child) => child.path === path)),
  )
  return activeItem?.path
})

// 判断当前激活的菜单是否有子菜单
const hasChildrenForActiveMenu = computed(() => {
  if (!activeTopMenu.value) return false
  const activeItem = menuItems.value.find((item) => item.path === activeTopMenu.value)
  return activeItem?.children && activeItem.children.length > 0
})

const handleMenuClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="sidebar">
    <Logo :collapse="isCollapse" />
    <el-menu
      :default-active="currentRoute.path"
      class="sidebar-menu"
      background-color="#304156"
      text-color="#bfcbd9"
      :active-text-color="primaryColor"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
    >
      <!-- 在mixed模式下的侧边栏逻辑 -->
      <template v-if="layoutMode === 'mixed'">
        <!-- 如果当前是仪表盘页面或没有子菜单的页面，显示所有一级菜单 -->
        <template v-if="currentRoute.path === '/dashboard' || !hasChildrenForActiveMenu">
          <template v-for="item in menuItems" :key="item.path">
            <el-menu-item :index="item.path" @click="handleMenuClick(item.path)">
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </el-menu-item>
          </template>
        </template>
        <!-- 否则显示当前激活的一级菜单的子菜单 -->
        <template v-else v-for="item in menuItems" :key="item.path">
          <template v-if="item.path === activeTopMenu && item.children && item.children.length > 0">
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
          </template>
        </template>
      </template>

      <!-- 在非mixed模式下，显示完整菜单 -->
      <template v-else v-for="item in menuItems" :key="item.path">
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

  .sidebar-menu {
    border-right: none;
    width: 100%;
  }
}
</style>
