<script lang="ts" setup>
defineOptions({
  name: 'ContentArticle',
})
const searchQuery = ref('')
</script>

<template>
  <div>
    article
    <el-input v-model="searchQuery" placeholder="搜索分类" class="mb-4" />
  </div>
</template>

<style lang="scss" scoped></style>
