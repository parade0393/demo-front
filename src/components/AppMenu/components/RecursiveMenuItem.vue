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

// 判断是否有子菜单且应该显示
const hasVisibleChildren = computed(() => {
  if (!props.menuItem.children || props.menuItem.children.length === 0) {
    return false
  }

  // 获取可见的子菜单项
  const visibleChildren = props.menuItem.children.filter((child) => !child.meta?.hidden)

  // 如果只有一个可见的子菜单项，且父级路由没有设置 alwaysShow，则不显示父级菜单
  if (visibleChildren.length === 1 && !props.menuItem.meta?.alwaysShow) {
    return false
  }

  // 如果是根路由（path 为 '/'），总是显示子菜单
  if (props.menuItem.path === '/') {
    return true
  }

  return props.showSubMenu && visibleChildren.length > 0
})

// 处理菜单点击
const handleClick = (path: string) => {
  emit('menu-click', path)
}
</script>

<template>
  <!-- 有子菜单的项 -->
  <el-sub-menu
    v-if="hasVisibleChildren"
    :index="menuItem.path"
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
    <template v-for="child in menuItem.children" :key="child.path">
      <!-- 递归调用自身，处理多级菜单 -->
      <recursive-menu-item
        v-if="child.children && child.children.length > 0 && !child.meta?.hidden"
        :menu-item="child"
        :base-path="menuItem.path"
        :show-sub-menu="showSubMenu"
        @menu-click="handleClick"
      />

      <!-- 渲染叶子节点 -->
      <el-menu-item
        v-else-if="!child.meta?.hidden"
        :index="menuItem.path + '/' + child.path"
        @click="handleClick(menuItem.path + '/' + child.path)"
      >
        <el-icon v-if="child.meta?.icon">
          <component :is="child.meta.icon" />
        </el-icon>
        <span>{{ child.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-sub-menu>

  <!-- 没有子菜单的项 -->
  <el-menu-item
    v-else-if="!menuItem.meta?.hidden"
    :index="menuItem.path"
    @click="handleClick(menuItem.path)"
  >
    <el-icon v-if="menuItem.meta?.icon">
      <component :is="menuItem.meta.icon" />
    </el-icon>
    <span>{{ menuItem.meta?.title }}</span>
  </el-menu-item>
</template>
