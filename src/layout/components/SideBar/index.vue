<script lang="ts" setup>
import { inject, ref, computed } from 'vue'
import Logo from '../Logo/index.vue'
import AppMenu from '@/components/AppMenu/index.vue'
import { useMenu } from '@/hooks/useMenu'
import { usePermissionStore } from '@/stores/permission'
import { storeToRefs } from 'pinia'

const { routes } = storeToRefs(usePermissionStore())
// 注入侧边栏折叠状态
const isCollapse = inject('isCollapse', ref(false))

// 使用菜单hooks获取相关数据和方法
const { primaryColor } = useMenu()

// 使用CSS变量设置颜色
const backgroundColor = computed(() => 'var(--sidebar-bg)')
const textColor = computed(() => 'var(--sidebar-menu-text)')
</script>

<template>
  <div class="sidebar">
    <Logo :collapse="isCollapse" />
    <AppMenu
      :menu-items="routes"
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
  // 移除硬编码的背景色，使用sidebar-styles.scss中定义的样式
  background-color: var(--sidebar-bg);

  .sidebar-menu {
    border-right: none;
    width: 100%;
  }
}
</style>
