import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  //知识点
  const config: UserConfig = {
    base: env.VITE_BASE_URL,
    css: {
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          api: 'modern-compiler',
          //知识点
          additionalData: `@use "@/styles/var.scss";`,
        },
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      AutoImport({
        // 导入 Vue 函数，如：ref, reactive, toRef 等
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts', // 自动生成声明文件
        dirs: ['src/hooks', 'src/stores'], // 自动导入 hooks 和 stores
        vueTemplate: true, // 允许模板里也自动导入
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: true,
        },
      }),

      Components({
        dirs: ['src/components'], // 自动扫描 components 目录
        extensions: ['vue', 'md'], // 支持 vue 和 md 组件
        deep: true, // 支持子目录递归
        dts: 'src/types/components.d.ts', // 自动生成声明文件
        // 导入 Element Plus函数，如：ElMessage, ElMessageBox 等
        resolvers: [ElementPlusResolver()],
      }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
  return config
})
