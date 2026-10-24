import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'

// 创建带统一配置的 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器：把 Pinia 中的 token 注入 Authorization 头
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一处理业务码和错误
request.interceptors.response.use(
  (response) => {
    const data = response.data
    // 业务 code 为 200 时返回 res.data（即整个 { code, data } 响应体），否则抛出错误
    // 调用方拿到后用 res.data 取真正的业务数据
    if (data.code === 200) return data
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        // 认证失效：清空登录态并跳回登录页
        useUserStore().logout()
        ElMessage.error('登录已过期，请重新登录')
        router.push('/login')
      } else if (status === 500) {
        ElMessage.error('服务器错误，请稍后重试')
      }
    }
    return Promise.reject(error)
  }
)

export default request