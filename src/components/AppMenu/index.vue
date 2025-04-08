<script lang="ts" setup>
import { computed } from 'vue'
import type { MenuItem } from '@/config/menu'
import { useMenu } from '@/hooks/useMenu'

interface Props {
  menuItems: MenuItem[]
  mode?: 'horizontal' | 'vertical'
  collapse?: boolean
  backgroundColor?: string
  textColor?: string
  activeTextColor?: string
  uniqueOpened?: boolean
  collapseTransition?: boolean
  showSubMenu?: boolean
  inMixedMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
  collapse: false,
  backgroundColor: '#304156',
  textColor: '#bfcbd9',
  uniqueOpened: true,
  collapseTransition: false,
  showSubMenu: true,
  inMixedMode: false,
})

const { activeTopMenu, handleMenuClick, currentRoute } = useMenu()

// 计算当前激活的菜单项
const activeMenu = computed(() => {
  return props.inMixedMode ? activeTopMenu.value : currentRoute.path
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
    <template v-if="inMixedMode">
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
