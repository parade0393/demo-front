<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

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
    if (newPath && !visitedViews.value.some((v) => v.path === newPath)) {
      visitedViews.value.push({
        path: newPath,
        title: (route.meta.title as string) || '未命名页面',
        name: route.name as string,
      })
    }
    activeTag.value = newPath
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
</script>

<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <el-scrollbar>
        <div class="tags-view-item" v-for="tag in visitedViews" :key="tag.path">
          <el-tag
            :effect="activeTag === tag.path ? 'dark' : 'plain'"
            closable
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
  </div>
</template>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.12),
    0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
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
}
</style>
