<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 当前激活的菜单（去掉 /:id 这种动态段）
const activeMenu = computed(() => {
  if (route.path === '/' || route.path === '/dashboard') return '/dashboard'
  if (route.path === '/books/new') return '/books/new'
  if (route.path === '/borrow/new') return '/borrow/new'
  if (route.path === '/readers') return '/readers'
  if (route.path === '/repair/new') return '/repair/new'
  if (route.path.startsWith('/books')) return '/books'
  if (route.path.startsWith('/records')) return '/records'
  return route.path
})

// 侧边栏折叠
const isCollapse = ref(false)

// 退出登录：调用 store 的 logout 方法
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消
  }
}

// 头像取用户名首字母
const avatarText = computed(() => (userStore.userName || '?').charAt(0).toUpperCase())
</script>

<template>
  <el-container class="layout-container">

    <!-- 左侧菜单栏：深藏青 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo-box">
        <div class="logo-icon">
          <el-icon :size="22" color="#fff"><Reading /></el-icon>
        </div>
        <transition name="fade">
          <span v-show="!isCollapse" class="logo-text">BookAdmin</span>
        </transition>
      </div>

      <!-- 侧边栏顶部：显示当前登录用户 -->
      <div class="sidebar-user">
        <el-avatar :size="32" class="sidebar-avatar">{{ avatarText }}</el-avatar>
        <template v-if="!isCollapse">
          <div class="sidebar-user-meta">
            <span class="sidebar-current">当前用户：{{ userStore.username }}</span>
            <el-button
              type="danger"
              size="small"
              text
              class="sidebar-logout"
              @click="handleLogout"
            >
              <el-icon><SwitchButton /></el-icon> 退出登录
            </el-button>
          </div>
        </template>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#0f172a"
        text-color="#94a3b8"
        active-text-color="#ffffff"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/books">
          <el-icon><Notebook /></el-icon>
          <template #title>图书管理</template>
        </el-menu-item>
        <el-menu-item index="/books/new">
          <el-icon><DocumentAdd /></el-icon>
          <template #title>新增图书</template>
        </el-menu-item>
        <el-menu-item index="/borrow/new">
          <el-icon><Reading /></el-icon>
          <template #title>新增借阅</template>
        </el-menu-item>
        <el-menu-item index="/readers">
          <el-icon><UserFilled /></el-icon>
          <template #title>借阅人管理</template>
        </el-menu-item>
        <el-menu-item index="/repair/new">
          <el-icon><Tools /></el-icon>
          <template #title>新增维修</template>
        </el-menu-item>
        <el-menu-item index="/records">
          <el-icon><Tickets /></el-icon>
          <template #title>借阅记录</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>

      <!-- 顶部导航栏：纯白 + 细腻底部阴影 -->
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" :size="20" @click="isCollapse = !isCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.path !== '/dashboard'">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" class="avatar">{{ avatarText }}</el-avatar>
              <div class="user-meta">
                <span class="username">{{ userStore.userName || '未登录' }}</span>
                <span class="user-role">{{ userStore.userRole }}</span>
              </div>
              <el-icon :size="14" class="caret"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100vh;
}

/* ========== 侧边栏 ========== */
.aside {
  background: #0f172a;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}
.logo-box {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
}
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-text {
  font-size: 17px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}
.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.sidebar-avatar {
  background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
  color: #fff !important;
  font-weight: 600;
  flex-shrink: 0;
}
.sidebar-user-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}
.sidebar-current {
  font-size: 13px;
  color: #cbd5e1;
  white-space: nowrap;
}
.sidebar-logout {
  padding: 0;
  height: 22px;
  font-size: 12px;
  color: #f87171 !important;
}
.sidebar-logout:hover {
  color: #fca5a5 !important;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.aside :deep(.el-menu) { border-right: none; padding: 12px 0; }
.aside :deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin: 2px 12px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}
.aside :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.06) !important;
  color: #fff !important;
}
.aside :deep(.el-menu-item.is-active) {
  background: #1e40af !important;
  color: #fff !important;
  font-weight: 500;
}

/* ========== 顶部导航 ========== */
.header {
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  height: 60px;
  box-shadow: var(--shadow-header);
}
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}
.collapse-btn {
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
}
.collapse-btn:hover { color: var(--el-color-primary); }
.header-right { display: flex; align-items: center; }
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 12px 6px 6px;
  border-radius: 20px;
  transition: background 0.2s;
}
.user-info:hover { background: #f1f5f9; }
.avatar {
  background: linear-gradient(135deg, #1e40af, #3b82f6) !important;
  color: #fff !important;
  font-weight: 600;
}
.user-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.username {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}
.user-role {
  font-size: 11px;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.caret { color: #94a3b8; }

/* ========== 内容区 ========== */
.main {
  background: var(--bg-page);
  padding: 24px;
  overflow-y: auto;
}
</style>