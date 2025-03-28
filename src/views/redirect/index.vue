<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params

  // 使用replace而不是push，避免在历史记录中添加新条目
  router.replace({ path: '/' + path, query })
})
</script>

<template>
  <div>
    <!-- 重定向中... -->
  </div>
</template>
