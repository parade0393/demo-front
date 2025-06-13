<script lang="ts" setup>
import { computed } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import {
  getVisibleChildren,
  shouldShowSubMenu,
  getFullPathWithQuery,
  getFullPath,
} from '@/utils/menu'

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
  (e: 'menu-click', path: string, meta?: Record<string, unknown>): void
}>()

// 获取可见的子节点
const visibleChildren = computed(() => getVisibleChildren(props.menuItem))

// 判断是否应该显示子菜单
const shouldShowSubMenuComputed = computed(() => {
  if (!props.showSubMenu) return false
  return shouldShowSubMenu(props.menuItem)
})

// 处理菜单点击
const handleClick = (path: string, meta?: Record<string, unknown>) => {
  const queryString = meta?.query as string | undefined
  const fullPath = getFullPathWithQuery(path, props.basePath, queryString)
  emit('menu-click', fullPath, meta)
}
</script>

<template>
  <!-- 有子节点且需要显示子菜单的情况 -->
  <el-sub-menu
    v-if="shouldShowSubMenuComputed"
    :index="getFullPath(menuItem.path, basePath)"
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
        :base-path="getFullPath(menuItem.path, basePath)"
        :show-sub-menu="showSubMenu"
        @menu-click="handleClick"
      />
    </template>
  </el-sub-menu>

  <!-- 只有一个子节点且不需要显示子菜单的情况 -->
  <template v-else-if="visibleChildren.length === 1">
    <el-menu-item
      :index="getFullPath(visibleChildren[0].path, basePath)"
      @click="handleClick(visibleChildren[0].path, visibleChildren[0].meta)"
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
    :index="getFullPath(menuItem.path, basePath)"
    @click="handleClick(menuItem.path, menuItem.meta)"
  >
    <el-icon v-if="menuItem.meta?.icon">
      <component :is="menuItem.meta.icon" />
    </el-icon>
    <span>{{ menuItem.meta?.title }}</span>
  </el-menu-item>
</template>
