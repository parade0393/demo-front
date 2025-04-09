<script lang="ts" setup>
import { computed } from 'vue'
import type { MenuItem } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'
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

const { activeTopMenu, handleMenuClick, currentRoute, layoutMode } = useMenu()

// 判断是否显示子菜单，混合模式的顶部菜单不显示
const showSubMenu = computed(() => {
  return !(props.mode === 'horizontal' && layoutMode.value === 'mixed')
})

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  if (layoutMode.value === 'mixed' && props.mode === 'horizontal') {
    return activeTopMenu.value
  }
  return currentRoute.path
})

// // 判断菜单项是否有子菜单且应该显示
// const shouldShowSubMenu = (menu: MenuItem) => {
//   return menu.children && menu.children.length > 0 && showSubMenu.value
// }

// 获取当前激活的顶级菜单及其子菜单
const currentActiveTopMenu = computed(() => {
  // 查找当前激活的顶级菜单
  const activeMenu = props.menuItems.find((item) => item.path === activeTopMenu.value)

  if (!activeMenu) return []

  // 如果有子菜单，返回子菜单数组；否则返回自身作为数组
  return activeMenu.children?.length ? activeMenu.children : [activeMenu]
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
    <!-- 混合模式 -->
    <template v-if="layoutMode === 'mixed'">
      <!-- 顶部菜单 - 只显示一级菜单 -->
      <template v-if="mode === 'horizontal'">
        <el-menu-item
          v-for="item in menuItems"
          :key="item.path"
          :index="item.path"
          @click="handleMenuClick(item.path)"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>

      <!-- 侧边菜单 - 显示当前选中顶级菜单的子菜单 -->
      <template v-else>
        <template v-for="menu in currentActiveTopMenu" :key="menu.path">
          <!-- 使用递归组件渲染菜单项 -->
          <recursive-menu-item
            :menu-item="menu"
            :base-path="menu.path"
            @menu-click="handleMenuClick"
          />
        </template>
      </template>
    </template>

    <!-- 标准模式 -->
    <template v-else>
      <template v-for="item in menuItems" :key="item.path">
        <!-- 使用递归组件渲染菜单项 -->
        <recursive-menu-item
          :menu-item="item"
          :base-path="item.path"
          :show-sub-menu="showSubMenu"
          @menu-click="handleMenuClick"
        />
      </template>
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
