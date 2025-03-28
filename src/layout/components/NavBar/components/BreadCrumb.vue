<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 面包屑数据结构
interface BreadcrumbItem {
  path: string
  title: string
}

const route = useRoute()
const router = useRouter()

// 面包屑数据
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 监听路由变化，更新面包屑
watch(
  () => route.path,
  () => {
    const matched = route.matched.filter((item) => item.meta && item.meta.title)

    // 判断第一项是否是首页
    if (matched.length === 0 || matched[0].path !== '/dashboard') {
      breadcrumbs.value = [
        { path: '/dashboard', title: '首页' }, // 添加首页
        ...matched.map((item) => ({
          path: item.path,
          title: item.meta.title as string,
        })),
      ]
    } else {
      // 如果第一项是首页，直接使用 matched
      breadcrumbs.value = matched.map((item) => ({
        path: item.path,
        title: '首页',
      }))
    }
  },
  { immediate: true },
)

// 处理面包屑点击
const handleBreadcrumbClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      <span v-if="index === breadcrumbs.length - 1" class="no-redirect">
        {{ item.title }}
      </span>
      <a v-else class="redirect" @click.prevent="handleBreadcrumbClick(item.path)">
        {{ item.title }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: unset;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }

  .redirect {
    color: #666;
    font-weight: 600;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
