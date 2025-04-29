<script lang="ts" setup>
import { menuApi } from '@/api'

onMounted(() => {
  menuApi.fetchUserMenuListApi().then((res) => {
    console.log(res)
  })
})
</script>

<template>
  <div>菜单</div>
</template>

<style lang="scss" scoped></style>
