<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  /** 布局模式 */
  mode: 'left-sidebar' | 'right-sidebar' | 'top-menu' | 'mixed'
  /** 是否激活状态 */
  isActive?: boolean
  /** 主题色 */
  primaryColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  primaryColor: '#409EFF',
})

// 计算图标颜色
const iconColor = computed(() => {
  return props.isActive ? props.primaryColor : '#909399'
})

// 计算内容区域颜色
const contentColor = computed(() => {
  return props.isActive ? '#e6f7ff' : '#f5f7fa'
})

// 计算边框颜色
const borderColor = computed(() => {
  return props.isActive ? props.primaryColor : '#dcdfe6'
})
</script>

<template>
  <div class="layout-mode-icon" :class="[`mode-${mode}`, { active: isActive }]">
    <!-- 左侧菜单布局图标 -->
    <template v-if="mode === 'left-sidebar'">
      <div class="icon-container">
        <div class="sidebar" :style="{ backgroundColor: iconColor }">
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
        </div>
        <div class="content" :style="{ backgroundColor: contentColor, borderColor }">
          <div class="header" :style="{ backgroundColor: iconColor }"></div>
          <div class="main"></div>
        </div>
      </div>
    </template>

    <!-- 右侧菜单布局图标 -->
    <template v-else-if="mode === 'right-sidebar'">
      <div class="icon-container">
        <div class="content" :style="{ backgroundColor: contentColor, borderColor }">
          <div class="header" :style="{ backgroundColor: iconColor }"></div>
          <div class="main"></div>
        </div>
        <div class="sidebar" :style="{ backgroundColor: iconColor }">
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
        </div>
      </div>
    </template>

    <!-- 顶部菜单布局图标 -->
    <template v-else-if="mode === 'top-menu'">
      <div class="icon-container">
        <div class="content top-mode" :style="{ backgroundColor: contentColor, borderColor }">
          <div class="header" :style="{ backgroundColor: iconColor }">
            <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
            <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
            <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          </div>
          <div class="main"></div>
        </div>
      </div>
    </template>

    <!-- 混合布局图标 -->
    <template v-else-if="mode === 'mixed'">
      <div class="icon-container">
        <div class="content mixed-mode" :style="{ backgroundColor: contentColor, borderColor }">
          <div class="header" :style="{ backgroundColor: iconColor }">
            <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
            <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
          </div>
          <div class="body-container">
            <div class="sidebar" :style="{ backgroundColor: iconColor }">
              <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
              <div class="menu-item" :style="{ backgroundColor: iconColor }"></div>
            </div>
            <div class="main"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.layout-mode-icon {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;

  .icon-container {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 4px;
    overflow: hidden;

    .sidebar {
      width: 25%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 8px;
      gap: 4px;

      .menu-item {
        width: 70%;
        height: 4px;
        border-radius: 1px;
        opacity: 0.8;
      }
    }

    .content {
      flex: 1;
      height: 100%;
      border: 1px solid;
      display: flex;
      flex-direction: column;

      &.top-mode,
      &.mixed-mode {
        width: 100%;

        .header {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;

          .menu-item {
            width: 16px;
            height: 3px;
            border-radius: 1px;
            opacity: 0.8;
          }
        }
      }

      &.mixed-mode {
        .body-container {
          display: flex;
          flex: 1;

          .sidebar {
            width: 20%;
            height: 100%;
            padding-top: 6px;
          }

          .main {
            flex: 1;
          }
        }
      }

      .header {
        height: 16px;
      }

      .main {
        flex: 1;
      }
    }
  }
}
</style>
