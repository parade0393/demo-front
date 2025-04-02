<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { presetColors } from '@/config/theme'

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
const primaryColor = computed({
  get: () => configStore.config.theme.primaryColor,
  set: (val) => {
    if (val) {
      configStore.updateThemeColor(val)
    } else {
      configStore.updateThemeColor(presetColors[0])
    }
  },
})

// 本地模式变量，用于开关组件
const darkMode = ref(configStore.config.theme.darkMode)
const mourningMode = ref(configStore.config.theme.mourningMode)
const colorWeakMode = ref(configStore.config.theme.colorWeakMode)

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

//复制配置到剪贴板
const copyConfig = () => {
  const config = {
    primaryColor: primaryColor.value,
    darkMode: darkMode.value,
    mourningMode: mourningMode.value,
    colorWeakMode: colorWeakMode.value,
  }
  // 将配置转换为Json格式的字符串并复制到剪贴板
  const configString = JSON.stringify(config, null, 2)
  navigator.clipboard
    .writeText(configString)
    .then(() => {
      // 提示复制成功
      ElMessage.success('配置已复制到剪贴板')
    })
    .catch(() => {
      // 提示复制失败
      ElMessage.error('复制配置失败')
    })
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
          <el-color-picker v-model="primaryColor" :predefine="presetColors" color-format="hex" />
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
        <el-button type="primary" @click="copyConfig">复制</el-button>
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
