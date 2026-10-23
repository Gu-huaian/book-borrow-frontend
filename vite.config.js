import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools' // 1. 引入插件

export default defineConfig({
  // 配置 @ 指向 src，让 `import ... from '@/xxx'` 这种路径可用
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    VueDevTools() // 2. 加上这一行
  ]
})