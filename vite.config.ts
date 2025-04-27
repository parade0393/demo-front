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
      mode === 'development' && vueDevTools(), //当 mode 不是 'development' 时， mode === 'development' && vueDevTools() 会返回 false,就不会加载这个插件
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
    server: {
      port: env.VITE_PORT ? parseInt(env.VITE_PORT) : 6060,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL, //后端地址
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'), // 重写路径,"开头是 /api" 的地方,把它替换成 /api
        },
      },
    },
  }
  // 过滤掉 plugins 数组中的 false 值
  config.plugins = config.plugins?.filter(Boolean)
  return config
})
