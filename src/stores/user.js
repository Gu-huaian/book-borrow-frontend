import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// useXxxStore 是 Pinia 的命名规范（use 前缀 + Store 后缀）
export const useUserStore = defineStore(
  'user',
  () => {
    // ========== State（响应式状态）==========
    const token = ref('')
    const userInfo = ref({ name: '', role: '' })

    // ========== Getters（计算属性）==========
    const isLoggedIn = computed(() => !!token.value)
    const username = computed(() => userInfo.value.name)
    const userRole = computed(() => userInfo.value.role)
    // 兼容别名（部分旧组件使用 userName）
    const userName = username

    // ========== Actions（方法）==========
    // 模拟登录：根据用户名关键字稳定映射角色，保证同一用户名角色不随机变化
    const login = (username) => {
      const mockToken = 'mock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
      const lower = (username || '').toLowerCase()
      const role = lower.includes('admin') ? 'admin' : lower.includes('librarian') ? 'librarian' : 'reader'

      token.value = mockToken
      userInfo.value = { name: username, role }
    }

    // 退出登录：清空状态（插件会自动同步清空 localStorage）
    const logout = () => {
      token.value = ''
      userInfo.value = { name: '', role: '' }
    }

    return { token, userInfo, isLoggedIn, username, userName, userRole, login, logout }
  },
  {
    // 持久化配置（pinia-plugin-persistedstate）
    // store 的整个 state 会自动存到 localStorage，刷新后自动恢复
    persist: true,
  }
)