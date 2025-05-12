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
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (非组件)
        // 注意：此处的ElementPlusResolver主要针对的是非组件的API方法，如ElMessage。
        // 组件的自动导入由Components插件负责。
        // eslint报错解决（生成全局声明文件）
        resolvers: [ElementPlusResolver()],
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts', // 自动生成声明文件
        dirs: ['src/hooks', 'src/stores'], // 自动导入 hooks 和 stores
        vueTemplate: true, // 允许模板里也自动导入
        eslintrc: {
          enabled: true, // 默认false, true启用。生成一次就可以，避免每次工程启动都生成，一旦生成配置文件之后，最好把enable关掉，即改成false。否则这个文件每次会在重新加载的时候重新生成，这会导致eslint有时会找不到这个文件。当需要更新配置文件的时候，再重新打开
          filepath: './.eslintrc-auto-import.json', // 生成json文件,eslintrc中引入
          globalsPropValue: true,
        },
      }),

      Components({
        dirs: ['src/components'], // 自动扫描 components 目录
        extensions: ['vue', 'md'], // 支持 vue 和 md 组件
        deep: true, // 支持子目录递归
        dts: 'src/types/components.d.ts', // 自动生成声明文件
        // 自动注册 ElementPlus 组件
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
