<script lang="ts" setup>
import { inject, ref, computed } from 'vue'
import Logo from '../Logo/index.vue'
import AppMenu from '@/components/AppMenu/index.vue'
import { menuItems } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'
import { useConfigStore } from '@/stores/config'

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse', ref(false))

// 使用菜单hooks获取相关数据和方法
const { primaryColor } = useMenu()

// 获取配置信息
const configStore = useConfigStore()

// 获取侧边栏风格
const sidebarStyle = computed(() => configStore.config.theme.sidebarStyle)

// 根据侧边栏风格设置背景色
const backgroundColor = computed(() => {
  return sidebarStyle.value === 'simple-white' ? '#ffffff' : '#304156'
})

// 根据侧边栏风格设置文本颜色
const textColor = computed(() => {
  return sidebarStyle.value === 'simple-white' ? '#303133' : '#bfcbd9'
})
</script>

<template>
  <div class="sidebar">
    <Logo :collapse="isCollapse" />
    <AppMenu
      :menu-items="menuItems"
      :active-text-color="primaryColor"
      :collapse="isCollapse"
      :background-color="backgroundColor"
      :text-color="textColor"
      class="sidebar-menu"
    />
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
