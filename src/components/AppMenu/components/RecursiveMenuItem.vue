<script lang="ts" setup>
import { computed } from 'vue'
import type { MenuItem } from '@/config/menu'

interface Props {
  /** 菜单项 */
  menuItem: MenuItem
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
  return (
    props.showSubMenu &&
    props.menuItem.children &&
    props.menuItem.children.length > 0 &&
    !props.menuItem.hidden
  )
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
      <el-icon v-if="menuItem.icon">
        <component :is="menuItem.icon" />
      </el-icon>
      <span>{{ menuItem.name }}</span>
    </template>

    <!-- 递归渲染子菜单项 -->
    <template v-for="child in menuItem.children" :key="child.path">
      <!-- 递归调用自身，处理多级菜单 -->
      <recursive-menu-item
        v-if="child.children && child.children.length > 0 && !child.hidden"
        :menu-item="child"
        :base-path="child.path"
        :show-sub-menu="showSubMenu"
        @menu-click="handleClick"
      />

      <!-- 渲染叶子节点 -->
      <el-menu-item v-else-if="!child.hidden" :index="child.path" @click="handleClick(child.path)">
        <el-icon v-if="child.icon">
          <component :is="child.icon" />
        </el-icon>
        <span>{{ child.name }}</span>
      </el-menu-item>
    </template>
  </el-sub-menu>

  <!-- 没有子菜单的项 -->
  <el-menu-item
    v-else-if="!menuItem.hidden"
    :index="menuItem.path"
    @click="handleClick(menuItem.path)"
  >
    <el-icon v-if="menuItem.icon">
      <component :is="menuItem.icon" />
    </el-icon>
    <span>{{ menuItem.name }}</span>
  </el-menu-item>
</template>
