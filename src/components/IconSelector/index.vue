<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface Props {
  /** 当前选中的图标名称 */
  modelValue?: string | null
  /** 是否禁用 */
  disabled?: boolean
  /** 占位文本 */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  disabled: false,
  placeholder: '请选择图标',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// 图标列表
const iconList = ref<string[]>([])

// 搜索关键字
const keyword = ref('')

// 是否显示图标选择面板
const popoverVisible = ref(false)

// 根据搜索关键字过滤图标
const filteredIconList = computed(() => {
  if (!keyword.value) return iconList.value
  return iconList.value.filter((icon) => icon.toLowerCase().includes(keyword.value.toLowerCase()))
})

// 当前选中的图标
const selectedIcon = computed(() => props.modelValue)

// 选择图标
const handleSelectIcon = (iconName: string) => {
  emit('update:modelValue', iconName)
  popoverVisible.value = false
}

// 清空选择
const clearSelection = () => {
  emit('update:modelValue', '')
}

// 初始化图标列表
onMounted(() => {
  iconList.value = Object.keys(ElementPlusIconsVue)
})
</script>

<template>
  <div class="icon-selector">
    <el-popover
      v-model:visible="popoverVisible"
      placement="bottom-start"
      :width="450"
      trigger="click"
      :disabled="disabled"
    >
      <template #reference>
        <div class="icon-selector__input" :class="{ 'is-disabled': disabled }">
          <div class="icon-selector__input-inner">
            <el-icon v-if="selectedIcon" class="icon-selector__selected-icon">
              <component :is="selectedIcon" />
            </el-icon>
            <span v-else class="icon-selector__placeholder">{{ placeholder }}</span>
            <span v-if="selectedIcon" class="icon-selector__selected-name">{{ selectedIcon }}</span>
          </div>
          <div class="icon-selector__suffix">
            <el-icon v-if="selectedIcon && !disabled" @click.stop="clearSelection">
              <CircleClose />
            </el-icon>
            <el-icon v-else>
              <ArrowDown />
            </el-icon>
          </div>
        </div>
      </template>

      <div class="icon-selector__panel">
        <div class="icon-selector__search">
          <el-input v-model="keyword" placeholder="搜索图标" clearable prefix-icon="Search" />
        </div>
        <div class="icon-selector__list">
          <template v-if="filteredIconList.length > 0">
            <div
              v-for="icon in filteredIconList"
              :key="icon"
              class="icon-selector__item"
              :class="{ 'is-active': selectedIcon === icon }"
              @click="handleSelectIcon(icon)"
            >
              <el-icon>
                <component :is="icon" />
              </el-icon>
              <span class="icon-selector__item-name">{{ icon }}</span>
            </div>
          </template>
          <div v-else class="icon-selector__empty">
            <el-empty description="无匹配图标" />
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style lang="scss" scoped>
.icon-selector {
  width: 100%;

  &__input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background-color: var(--el-fill-color-blank);
    cursor: pointer;
    transition: var(--el-transition-box-shadow);

    &:hover {
      border-color: var(--el-border-color-hover);
    }

    &.is-disabled {
      background-color: var(--el-disabled-bg-color);
      border-color: var(--el-border-color-light);
      color: var(--el-text-color-placeholder);
      cursor: not-allowed;
    }
  }

  &__input-inner {
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  &__selected-icon {
    margin-right: 8px;
    font-size: 16px;
  }

  &__selected-name {
    font-size: 14px;
    color: var(--el-text-color-regular);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__placeholder {
    font-size: 14px;
    color: var(--el-text-color-placeholder);
  }

  &__suffix {
    margin-left: 8px;
    color: var(--el-text-color-placeholder);
  }

  &__panel {
    max-height: 400px;
  }

  &__search {
    margin-bottom: 12px;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    max-height: 350px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: var(--el-fill-color-light);
    }

    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
    }

    .el-icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }

  &__item-name {
    font-size: 12px;
    width: 100%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__empty {
    grid-column: span 6;
    padding: 20px 0;
  }
}
</style>
