<script lang="ts" setup>
import { computed } from 'vue'
import type { MenuItem } from '@/config/menu'
import { useRouter } from 'vue-router'
import { useLayoutStrategy } from '@/hooks/useLayoutStrategy'
import RecursiveMenuItem from './components/RecursiveMenuItem.vue'

interface Props {
  /** 菜单项数组 */
  menuItems: MenuItem[]
  /** 菜单模式，水平或垂直 */
  mode?: 'horizontal' | 'vertical'
  /** 是否折叠菜单 */
  collapse?: boolean
  /** 菜单背景色 */
  backgroundColor?: string
  /** 菜单文本颜色 */
  textColor?: string
  /** 菜单激活文本颜色 */
  activeTextColor?: string
  /** 是否只保持一个子菜单展开 */
  uniqueOpened?: boolean
  /** 是否开启折叠动画 */
  collapseTransition?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
  collapse: false,
  backgroundColor: '#304156',
  textColor: '#bfcbd9',
  uniqueOpened: true,
  collapseTransition: false,
})

const router = useRouter()
const { shouldShowSubMenu, getActiveMenu, getTopMenuItems, getSideMenuItems } = useLayoutStrategy()

// 判断是否显示子菜单
const showSubMenu = computed(() => {
  return shouldShowSubMenu(props.mode)
})

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return getActiveMenu(props.mode)
})

// 菜单点击处理
const handleMenuClick = (path: string) => {
  router.push(path)
}

// 获取当前模式下应该显示的菜单项
const displayMenuItems = computed(() => {
  if (props.mode === 'horizontal') {
    return getTopMenuItems(props.menuItems)
  } else {
    return getSideMenuItems(props.menuItems)
  }
})
</script>

<template>
  <el-menu
    :default-active="activeMenu"
    :mode="mode"
    :background-color="backgroundColor"
    :text-color="textColor"
    :active-text-color="activeTextColor"
    :unique-opened="uniqueOpened"
    :collapse="collapse"
    :collapse-transition="collapseTransition"
    class="app-menu"
  >
    <template v-for="item in displayMenuItems" :key="item.path">
      <!-- 使用递归组件渲染菜单项 -->
      <recursive-menu-item
        :menu-item="item"
        :base-path="item.path"
        :show-sub-menu="showSubMenu"
        @menu-click="handleMenuClick"
      />
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>
.app-menu {
  border-right: none;
  width: 100%;

  &.el-menu--horizontal {
    border-bottom: none;
  }
}
</style>

<style lang="scss">
/* 全局样式，确保弹出菜单使用正确的背景色和hover背景色 */
.custom-popper-menu {
  .el-menu {
    background-color: var(--sidebar-menu-bg, #304156) !important;

    .el-menu-item,
    .el-sub-menu__title {
      color: var(--sidebar-menu-text, #bfcbd9) !important;

      &:hover {
        background-color: var(--sidebar-menu-hover-bg, #263445) !important;
      }
    }
  }
}
</style>
