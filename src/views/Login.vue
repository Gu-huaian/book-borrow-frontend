<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({ username: '', password: '' })

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const loginFormRef = ref()
const loading = ref(false)

const handleLogin = async () => {
  await loginFormRef.value.validate()
  loading.value = true
  try {
    // 调用登录接口 → 拦截器返回 res.data = { code: 200, data: {...} }
    const res = await login(form)
    const { token, userInfo } = res.data
    // 写入 Pinia（plugins 持久化会自动同步 localStorage）
    userStore.token = token
    userStore.userInfo = userInfo
    ElMessage.success('登录成功')
    router.push('/books') // 使用 Vue Router 跳转（单页应用，不触发整页重载）
  } catch (e) {
    ElMessage.error(e?.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- 全屏高级灰背景 + 居中卡片 -->
  <div class="login-page">
    <div class="login-wrap">
      <!-- 左侧：品牌区 -->
      <div class="brand-side">
        <div class="brand-content">
          <div class="brand-logo">
            <el-icon :size="36" color="#fff"><Reading /></el-icon>
          </div>
          <h1 class="brand-title">BookAdmin</h1>
          <p class="brand-subtitle">企业级图书借阅管理系统</p>
        </div>
      </div>

      <!-- 右侧：登录卡片 -->
      <div class="form-side">
        <div class="login-form-box">
          <h2 class="form-title">欢迎登录</h2>
          <p class="form-desc">请使用您的管理员账号登录系统</p>

          <el-form
            ref="loginFormRef"
            :model="form"
            :rules="rules"
            size="large"
            @keyup.enter="handleLogin"
          >
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="用户名">
                <template #prefix>
                  <el-icon class="input-icon"><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                show-password
              >
                <template #prefix>
                  <el-icon class="input-icon"><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                class="login-btn"
                :loading="loading"
                @click="handleLogin"
              >
                登 录
              </el-button>
            </el-form-item>
          </el-form>

          <p class="form-tip">演示环境，输入任意用户名密码即可登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: #f4f6f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* 双栏布局：左品牌 + 右表单 */
.login-wrap {
  display: flex;
  width: 880px;
  min-height: 520px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  background: #fff;
}

/* ========== 左侧品牌区 ========== */
.brand-side {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.brand-content { text-align: center; color: #fff; }
.brand-logo {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}
.brand-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: 1px;
}
.brand-subtitle {
  font-size: 14px;
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

/* ========== 右侧表单区 ========== */
.form-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}
.login-form-box { width: 100%; max-width: 360px; }
.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
}
.form-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}
.input-icon { color: #94a3b8; }
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 6px;
  margin-top: 8px;
}
.form-tip {
  text-align: center;
  font-size: 12px;
  color: var(--text-tertiary);
  margin: 8px 0 0;
}
</style>