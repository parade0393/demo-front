<script lang="ts" setup>
import { computed } from 'vue'
import type { MenuItem } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'

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
  /** 是否显示子菜单 */
  showSubMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
  collapse: false,
  backgroundColor: '#304156',
  textColor: '#bfcbd9',
  uniqueOpened: true,
  collapseTransition: false,
  showSubMenu: true,
})

const { activeTopMenu, handleMenuClick, currentRoute, layoutMode } = useMenu()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  // 在混合模式下，顶部菜单和侧边菜单的激活项计算方式不同
  if (layoutMode.value === 'mixed') {
    // 如果是水平模式（顶部菜单），激活项应该是顶级菜单路径
    if (props.mode === 'horizontal') {
      return activeTopMenu.value
    }
    // 如果是垂直模式（侧边菜单），激活项应该是当前路由路径
    return currentRoute.path
  }
  return currentRoute.path
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
    <!-- 混合模式下的侧边栏菜单 -->
    <template v-if="layoutMode === 'mixed'">
      <!-- 当前激活的顶级菜单有子菜单时，显示其子菜单 -->
      <template v-for="item in menuItems" :key="item.path">
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

      <!-- 当前激活的顶级菜单没有子菜单时，显示所有一级菜单 -->
      <template
        v-if="
          !menuItems.some(
            (item) => item.path === activeTopMenu && item.children && item.children.length > 0,
          )
        "
      >
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
    </template>

    <!-- 标准模式下的菜单 -->
    <template v-else>
      <template v-for="item in menuItems" :key="item.path">
        <!-- 有子菜单的项 -->
        <el-sub-menu
          v-if="item.children && item.children.length > 0 && showSubMenu"
          :index="item.path"
        >
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

        <!-- 没有子菜单的项或顶部菜单模式下的所有项 -->
        <el-menu-item
          v-else-if="!item.children || !showSubMenu"
          :index="item.path"
          @click="handleMenuClick(item.path)"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
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
