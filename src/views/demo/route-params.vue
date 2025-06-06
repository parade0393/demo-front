<script lang="ts" setup>
defineOptions({
  name: 'RouteParamsDemo',
})

const str =
  Object.keys(useRoute().query || {}).length > 0
    ? `路由参数: ${JSON.stringify(useRoute().query)}`
    : '无路由参数'
</script>

<template>
  <div>{{ str }}</div>
</template>

<style lang="scss" scoped></style>
