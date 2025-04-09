<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useConfigStore } from '@/stores/config'
import { presetColors, layoutModes, tagsViewStyles } from '@/config/theme'
import LayoutModeIcon from '@/layout/components/LayoutModeIcon/index.vue'

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

// 侧边栏风格变量
const sidebarStyle = computed({
  get: () => configStore.config.theme.sidebarStyle,
  set: (val) => {
    if (val) {
      configStore.updateSidebarStyle(val)
    }
  },
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

// 本地布局模式变量
const layoutMode = computed({
  get: () => configStore.config.layout.layoutMode,
  set: (val) => {
    if (val) {
      configStore.config.layout.layoutMode = val
    }
  },
})

// 本地标签页风格变量
const tagsViewStyle = computed({
  get: () => configStore.config.layout.tagsViewStyle,
  set: (val) => {
    if (val) {
      configStore.config.layout.tagsViewStyle = val
    }
  },
})

const copyConfig = () => {
  const config = {
    theme: {
      primaryColor: primaryColor.value,
      darkMode: darkMode.value,
      mourningMode: mourningMode.value,
      colorWeakMode: colorWeakMode.value,
      sidebarStyle: sidebarStyle.value,
    },
    layout: {
      layoutMode: layoutMode.value,
      tagsViewStyle: tagsViewStyle.value,
    },
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
        <div class="setting-item">
          <span class="setting-label">侧边栏风格</span>
          <el-radio-group v-model="sidebarStyle" size="small">
            <el-radio-button label="classic-blue">经典蓝</el-radio-button>
            <el-radio-button label="simple-white">极简白</el-radio-button>
            <el-radio-button label="dark-purple">暗夜紫</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="settings-section">
        <h3 class="section-title">布局设置</h3>
        <div class="setting-block">
          <span class="setting-label">布局模式</span>
          <div class="layout-mode-selector">
            <div
              v-for="mode in layoutModes"
              :key="mode"
              class="layout-mode-item"
              @click="layoutMode = mode"
              :class="{ active: layoutMode === mode }"
            >
              <LayoutModeIcon
                :mode="mode"
                :is-active="layoutMode === mode"
                :primary-color="primaryColor"
              />
              <span class="layout-mode-label">
                {{
                  mode === 'left-sidebar'
                    ? '左侧菜单'
                    : mode === 'right-sidebar'
                      ? '右侧菜单'
                      : mode === 'top-menu'
                        ? '顶部菜单'
                        : mode === 'mixed'
                          ? '混合布局'
                          : mode
                }}
              </span>
            </div>
          </div>
        </div>
        <div class="setting-item">
          <span class="setting-label">标签页风格</span>
          <el-select v-model="tagsViewStyle" placeholder="请选择标签页风格">
            <el-option v-for="style in tagsViewStyles" :key="style" :label="style" :value="style" />
          </el-select>
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
  :deep(.el-drawer__header) {
    margin-bottom: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-drawer__body) {
    padding: 0;
    overflow-y: auto;
  }

  .settings-content {
    padding: 20px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--el-text-color-primary);
  }

  .settings-section {
    margin-bottom: 24px;

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .setting-label {
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
    }

    .setting-block {
      margin-bottom: 16px;

      .setting-label {
        display: block;
        font-size: 14px;
        color: var(--el-text-color-regular);
        margin-bottom: 8px;
      }

      .layout-mode-selector {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        .layout-mode-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 12px 8px;
          border: 1px solid var(--el-border-color);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: var(--el-color-primary-light-5);
          }

          &.active {
            border-color: var(--el-color-primary);
            background-color: var(--el-color-primary-light-9);
          }

          .layout-mode-label {
            margin-top: 8px;
            font-size: 12px;
          }
        }
      }
    }
  }
}

.drawer-footer {
  padding: 16px 20px;
  text-align: right;
  border-top: 1px solid var(--el-border-color-lighter);
}
</style>
