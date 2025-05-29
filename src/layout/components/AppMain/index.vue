<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router'
import { inject, ref, watch } from 'vue'
import { useNavigation } from '@/hooks/useNavigation'
// 注入刷新视图的key
const refreshViewKey = inject('refreshViewKey', ref(0))
const { keepAliveComponents, handleRouteChange } = useNavigation()

const router = useRouter()

// 监听路由变化
watch(
  () => router.currentRoute.value,
  (to, from) => {
    handleRouteChange(to, from)
  },
)
</script>

<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="keepAliveComponents">
          <component :is="Component" :key="refreshViewKey" />
        </keep-alive>
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
