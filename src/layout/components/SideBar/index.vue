<script lang="ts" setup>
import { inject, ref } from 'vue'
import Logo from '../Logo/index.vue'
import AppMenu from '@/components/AppMenu/index.vue'
import { menuItems } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'

// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse', ref(false))

// 使用菜单hooks获取相关数据和方法
const { primaryColor } = useMenu()
</script>

<template>
  <div class="sidebar">
    <Logo :collapse="isCollapse" />
    <AppMenu
      :menu-items="menuItems"
      :active-text-color="primaryColor"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
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
