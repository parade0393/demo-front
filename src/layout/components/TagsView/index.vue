<script lang="ts" setup>
import { ref, watch, computed, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 注入刷新视图的方法
const refreshView = inject('refreshView') as () => void

interface TagView {
  path: string
  title: string
  name?: string
}

const route = useRoute()
const router = useRouter()

const visitedViews = ref<TagView[]>([
  {
    path: '/dashboard',
    title: '仪表盘',
    name: 'Dashboard',
  },
])

const activeTag = ref('/dashboard')

// 监听路由变化，添加标签
watch(
  () => route.path,
  (newPath) => {
    // 忽略重定向路由和隐藏路由
    if (
      newPath &&
      !newPath.startsWith('/redirect') &&
      !route.meta.hidden &&
      !visitedViews.value.some((v) => v.path === newPath)
    ) {
      visitedViews.value.push({
        path: newPath,
        title: (route.meta.title as string) || '未命名页面',
        name: route.name as string,
      })
    }
    // 如果不是重定向路由，则更新激活的标签
    if (!newPath.startsWith('/redirect')) {
      activeTag.value = newPath
    }
  },
  { immediate: true },
)

const handleTagClick = (path: string) => {
  activeTag.value = path
  router.push(path)
}

const closeTag = (path: string) => {
  const index = visitedViews.value.findIndex((v) => v.path === path)
  if (index !== -1) {
    visitedViews.value.splice(index, 1)
    // 如果关闭的是当前激活的标签，则跳转到最后一个标签
    if (path === activeTag.value) {
      const latestView = visitedViews.value.slice(-1)[0]
      if (latestView) {
        router.push(latestView.path)
      } else {
        router.push('/')
      }
    }
  }
}

// 关闭当前标签
const closeCurrentTag = () => {
  if (activeTag.value) {
    closeTag(activeTag.value)
  }
  closeDropdown()
}

// 关闭所有标签
const closeAllTags = () => {
  // 保留第一个标签（仪表盘）
  const firstTag = visitedViews.value[0]
  visitedViews.value = [firstTag]
  router.push(firstTag.path)
  closeDropdown()
}

// 关闭左侧标签
const closeLeftTags = () => {
  const index = visitedViews.value.findIndex((v) => v.path === activeTag.value)
  if (index > 0) {
    // 保留第一个标签（仪表盘）和当前激活标签及其右侧的标签
    const firstTag = visitedViews.value[0]

    // 创建新的数组，包含第一个标签和当前激活标签及其右侧的标签
    visitedViews.value = [firstTag, ...visitedViews.value.slice(index)]
  }
  closeDropdown()
}

// 关闭右侧标签
const closeRightTags = () => {
  if (activeTag.value) {
    const index = visitedViews.value.findIndex((v) => v.path === activeTag.value)
    if (index >= 0 && index < visitedViews.value.length - 1) {
      visitedViews.value = visitedViews.value.slice(0, index + 1)

      // // 如果当前激活的标签被关闭，则跳转到选中的标签
      // if (!visitedViews.value.some((v) => v.path === activeTag.value)) {
      //   router.push(selectedTag.value.path)
      // }
    }
  }
  closeDropdown()
}

// 关闭其他标签
const closeOtherTags = () => {
  // 保留第一个标签（仪表盘）和当前激活的标签
  const firstTag = visitedViews.value[0]
  const currentTag = visitedViews.value.find((v) => v.path === activeTag.value)

  if (currentTag && currentTag.path !== firstTag.path) {
    visitedViews.value = [firstTag, currentTag]
  } else {
    visitedViews.value = [firstTag]
  }

  closeDropdown()
}

// 刷新当前页面
const refreshCurrentTag = () => {
  // 使用注入的refreshView方法刷新页面
  refreshView()
  closeDropdown()
}

// 下拉菜单相关
const dropdownVisible = ref(false)

// const toggleDropdown = () => {
//   dropdownVisible.value = !dropdownVisible.value
// }

const closeDropdown = () => {
  dropdownVisible.value = false
}

// 判断标签是否可关闭
const isClosable = computed(() => (tag: TagView) => {
  // 仪表盘标签不可关闭
  return tag.path !== '/dashboard'
})
</script>

<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <el-scrollbar>
        <div class="tags-view-item" v-for="tag in visitedViews" :key="tag.path">
          <el-tag
            :effect="activeTag === tag.path ? 'dark' : 'plain'"
            :closable="isClosable(tag)"
            :disable-transitions="false"
            @click="handleTagClick(tag.path)"
            @close="closeTag(tag.path)"
            class="tag-item"
          >
            {{ tag.title }}
          </el-tag>
        </div>
      </el-scrollbar>
    </div>

    <!-- 操作图标和下拉菜单 -->
    <div class="tags-view-actions">
      <el-dropdown trigger="hover" @visible-change="dropdownVisible = $event">
        <el-button type="primary" size="small" circle>
          <el-icon><More /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="closeCurrentTag">
              <el-icon><Close /></el-icon>
              <span>关闭当前</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeOtherTags">
              <el-icon><CircleClose /></el-icon>
              <span>关闭其他</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeLeftTags">
              <el-icon><Back /></el-icon>
              <span>关闭左侧</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeRightTags">
              <el-icon><Right /></el-icon>
              <span>关闭右侧</span>
            </el-dropdown-item>
            <el-dropdown-item @click="refreshCurrentTag">
              <el-icon><Refresh /></el-icon>
              <span>刷新当前</span>
            </el-dropdown-item>
            <el-dropdown-item @click="closeAllTags">
              <el-icon><Delete /></el-icon>
              <span>关闭所有</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
  position: relative;
  display: flex;
  align-items: center;

  .tags-view-wrapper {
    flex: 1;
    overflow: hidden;

    .el-scrollbar__wrap {
      height: 34px;
    }

    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      margin: 4px 5px 0 5px;

      .tag-item {
        margin-right: 5px;
      }
    }
  }

  .tags-view-actions {
    padding-right: 10px;
    display: flex;
    align-items: center;
    height: 100%;

    .el-button {
      margin-left: 8px;
      padding: 6px;
    }
  }

  .contextmenu {
    margin: 0;
    background: var(--el-bg-color);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--el-text-color-primary);
    box-shadow: var(--el-box-shadow-light);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: var(--el-fill-color-light);
      }
    }
  }
}
</style>
