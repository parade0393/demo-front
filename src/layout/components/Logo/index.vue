<script lang="ts" setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/config'

interface Props {
  /** 是否折叠状态 */
  collapse?: boolean
  /** 是否显示标题 */
  showTitle?: boolean
  /** 自定义类名 */
  className?: string
  /** 是否在顶部导航栏中显示 */
  inNavbar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: false,
  showTitle: true,
  className: '',
  inNavbar: false,
})

// 使用配置store获取主题色和布局模式
const configStore = useConfigStore()
const primaryColor = computed(() => configStore.config.theme.primaryColor)

// 根据是否在导航栏中动态计算标题颜色
const titleColor = computed(() => {
  // 如果在导航栏中（顶部菜单模式），使用深色文本
  if (props.inNavbar) {
    return '#303133'
  }
  // 否则使用白色文本（侧边栏模式）
  return '#fff'
})
</script>

<template>
  <div class="logo-container" :class="[className, { collapse: collapse }]">
    <router-link to="/" class="logo-link">
      <svg
        class="logo-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 261.76 226.69"
        :style="{ color: primaryColor }"
      >
        <path
          d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z"
          fill="currentColor"
        />
        <path
          d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z"
          fill="#34495e"
        />
      </svg>
      <h1 v-if="showTitle" class="logo-title">Admin System</h1>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.logo-container {
  height: 50px;
  padding: 10px;
  overflow: hidden;
  background: #304156;
  transition: all 0.3s;

  &.collapse {
    padding: 10px 8px;
  }

  .logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .logo-svg {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    vertical-align: middle;
  }

  .logo-title {
    display: inline-block;
    margin: 0;
    color: v-bind(titleColor);
    font-weight: 600;
    line-height: 50px;
    font-size: 16px;
    font-family:
      Avenir,
      Helvetica Neue,
      Arial,
      Helvetica,
      sans-serif;
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.collapse {
    .logo-svg {
      margin-right: 0;
      margin: 0 auto;
    }
  }
}
</style>
