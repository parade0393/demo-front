<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { inject, ref } from 'vue'

// 注入刷新视图的key
const refreshViewKey = inject('refreshViewKey', ref(0))
</script>

<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" :key="refreshViewKey" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.app-main {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
