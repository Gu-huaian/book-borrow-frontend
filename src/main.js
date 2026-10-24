import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import App from './App.vue'
import router from './router'

// 仅开发环境启动 MSW：mock 掉后端接口
async function enableMocking() {
  if (!import.meta.env.DEV) return
  const { worker } = await import('./mock/browser')
  // onUnhandledRequest: 'bypass' → 未在 handlers 中定义的请求（静态资源、前端路由、devtools 等）直接放行，不做拦截
  await worker.start({ onUnhandledRequest: 'bypass' })
}

const app = createApp(App)
const pinia = createPinia()

await enableMocking()

// 挂载持久化插件 → store 里配置 persist: true 就自动存 localStorage
pinia.use(piniaPluginPersistedstate)

// 全局注册 Element Plus 所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')