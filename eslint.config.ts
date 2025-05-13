//Flat Config 模式（ESLint v8+ 的新方式）知识点
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import autoImportGlobals from './.eslintrc-auto-import.json' // 引入自动生成的 globals

/**
 * 配置 ESLint 规则和插件，适用于 Vue + TypeScript 项目。
 *
 * - `app/files-to-lint`：指定需要 lint 的文件类型（ts, mts, tsx, vue）。
 * - `app/files-to-ignore`：指定需要忽略的文件夹（如 dist、coverage）。
 * - 引入 Vue 相关的基础配置和推荐规则。
 * - 针对 `.vue` 文件，强制组件名为多单词（允许 index 和 404 例外）。
 * - `app/auto-import`：自动挂载全局变量，支持自动导入。
 * - `app/unused-vars`：配置未使用变量的检测规则，允许以下划线开头的变量不报错。
 */
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': [
        'error',
        {
          ignores: ['index', '404'], // 允许 index.vue 但强制其他 Vue 组件使用多单词名称
        },
      ],
    },
  },
  {
    name: 'app/auto-import',
    files: ['**/*.{ts,mts,tsx,vue}'],
    languageOptions: {
      globals: autoImportGlobals.globals, // 挂载到 languageOptions.globals
    },
  },
  {
    name: 'app/unused-vars',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
)
