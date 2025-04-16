<script lang="ts" setup>
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

interface Props {
  /** 菜单项 */
  menuItem: RouteRecordRaw
  /** 基础路径，用于构建完整路径 */
  basePath: string
  /** 是否显示子菜单 */
  showSubMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showSubMenu: true,
})

const emit = defineEmits<{
  (e: 'menu-click', path: string): void
}>()

// 获取完整路径
const getFullPath = (path: string) => {
  // 如果路径以 / 开头，说明是绝对路径，直接返回,一级菜单的路径是以 / 开头的
  if (path.startsWith('/')) {
    return path
  }
  // 否则拼接基础路径，会把所有连续的斜杠替换成一个斜杠，例如：/system/ + /user → /system//user，经过 replace 后变成 /system/user。
  console.log('getFullPath', path, props.basePath)
  return `${props.basePath}/${path}`.replace(/\/+/g, '/')
}

// 获取可见的子节点
const visibleChildren = computed(() => {
  if (!props.menuItem.children || props.menuItem.children.length === 0) {
    return []
  }
  return props.menuItem.children.filter((child) => !child.meta?.hidden)
})

// 判断是否应该显示子菜单
const shouldShowSubMenu = computed(() => {
  // 如果没有子节点，不显示子菜单
  if (visibleChildren.value.length === 0) {
    return false
  }

  // 如果有多个子节点，显示子菜单
  if (visibleChildren.value.length > 1) {
    return true
  }

  // 如果只有一个子节点，根据 alwaysShow 决定是否显示子菜单
  return props.menuItem.meta?.alwaysShow === true
})

// 处理菜单点击
const handleClick = (path: string) => {
  emit('menu-click', getFullPath(path))
}
</script>

<template>
  <!-- 有子节点且需要显示子菜单的情况 -->
  <el-sub-menu
    v-if="shouldShowSubMenu"
    :index="getFullPath(menuItem.path)"
    :popper-append-to-body="true"
    popper-class="custom-popper-menu"
  >
    <template #title>
      <el-icon v-if="menuItem.meta?.icon">
        <component :is="menuItem.meta.icon" />
      </el-icon>
      <span>{{ menuItem.meta?.title }}</span>
    </template>

    <!-- 递归渲染子菜单项 -->
    <template v-for="child in visibleChildren" :key="child.path">
      <recursive-menu-item
        :menu-item="child"
        :base-path="getFullPath(menuItem.path)"
        :show-sub-menu="showSubMenu"
        @menu-click="handleClick"
      />
    </template>
  </el-sub-menu>

  <!-- 只有一个子节点且不需要显示子菜单的情况 -->
  <template v-else-if="visibleChildren.length === 1">
    <el-menu-item
      :index="getFullPath(visibleChildren[0].path)"
      @click="handleClick(visibleChildren[0].path)"
    >
      <el-icon v-if="visibleChildren[0].meta?.icon">
        <component :is="visibleChildren[0].meta.icon" />
      </el-icon>
      <span>{{ visibleChildren[0].meta?.title }}</span>
    </el-menu-item>
  </template>

  <!-- 叶子节点的情况 -->
  <el-menu-item
    v-else-if="!menuItem.meta?.hidden"
    :index="getFullPath(menuItem.path)"
    @click="handleClick(menuItem.path)"
  >
    <el-icon v-if="menuItem.meta?.icon">
      <component :is="menuItem.meta.icon" />
    </el-icon>
    <span>{{ menuItem.meta?.title }}</span>
  </el-menu-item>
</template>
