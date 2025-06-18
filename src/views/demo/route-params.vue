<script lang="ts" setup>
defineOptions({
  name: 'RouteParamsDemo',
})

const computedStr = computed(() => {
  const query = useRoute().query || {}
  return Object.keys(query).length > 0 ? `路由参数: ${JSON.stringify(query)}` : '无路由参数'
})
</script>

<template>
  <div>{{ computedStr }}</div>
</template>

<style lang="scss" scoped></style>
