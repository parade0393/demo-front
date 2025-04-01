<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useConfigStore } from '@/stores/config'

const props = defineProps<{
  visible: boolean
}>()

const drawerVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
})

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

// 使用配置store
const configStore = useConfigStore()

// 本地主题色变量，用于颜色选择器
const primaryColor = ref(configStore.config.theme.primaryColor)

// 本地模式变量，用于开关组件
const darkMode = ref(configStore.config.theme.darkMode)
const mourningMode = ref(configStore.config.theme.mourningMode)
const colorWeakMode = ref(configStore.config.theme.colorWeakMode)

// 预设的主题色选项
const presetColors = [
  '#409EFF', // 默认蓝色
  '#67C23A', // 绿色
  '#E6A23C', // 黄色
  '#F56C6C', // 红色
  '#909399', // 灰色
  '#9370DB', // 紫色
  '#00BFFF', // 天蓝色
  '#FF69B4', // 粉色
]

// 监听主题色变化并更新
watch(primaryColor, (newColor) => {
  console.log('新主题色:', newColor)
  configStore.updateThemeColor(newColor)
})

// 监听暗色模式变化并更新
watch(darkMode, (isDark) => {
  configStore.toggleDarkTheme(isDark)
})

// 监听哀悼模式变化并更新
watch(mourningMode, (isMourning) => {
  configStore.toggleMourning(isMourning)
})

// 监听色弱模式变化并更新
watch(colorWeakMode, (isColorWeak) => {
  configStore.toggleColorWeak(isColorWeak)
})

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
}

// 重置配置
const resetSettings = () => {
  configStore.resetConfig()
  primaryColor.value = configStore.config.theme.primaryColor
  darkMode.value = configStore.config.theme.darkMode
  mourningMode.value = configStore.config.theme.mourningMode
  colorWeakMode.value = configStore.config.theme.colorWeakMode
}
</script>

<template>
  <el-drawer
    title="系统设置"
    v-model="drawerVisible"
    :with-header="true"
    direction="rtl"
    size="300px"
    @close="closeDrawer"
  >
    <div class="settings-drawer">
      <div class="settings-section">
        <h3 class="section-title">主题设置</h3>
        <div class="setting-item">
          <span class="setting-label">主题色</span>
          <el-color-picker
            v-model="primaryColor"
            show-alpha
            :predefine="presetColors"
            color-format="hex"
          />
        </div>
        <div class="setting-item">
          <span class="setting-label">暗色模式</span>
          <el-switch v-model="darkMode" />
        </div>
        <div class="setting-item">
          <span class="setting-label">哀悼模式</span>
          <el-switch v-model="mourningMode" />
        </div>
        <div class="setting-item">
          <span class="setting-label">色弱模式</span>
          <el-switch v-model="colorWeakMode" />
        </div>
      </div>

      <div class="drawer-footer">
        <el-button type="primary" @click="closeDrawer">确定</el-button>
        <el-button @click="resetSettings">重置</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.settings-drawer {
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .settings-section {
    margin-bottom: 20px;

    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebeef5;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .setting-label {
        font-size: 14px;
      }
    }
  }

  .drawer-footer {
    margin-top: auto;
    text-align: center;
  }
}
</style>
