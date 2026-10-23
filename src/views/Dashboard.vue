<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useBookStore } from '@/stores/book'

const router = useRouter()
const userStore = useUserStore()
const bookStore = useBookStore()

const loading = ref(true)

const stats = computed(() => bookStore.stats)
const recentBooks = computed(() => bookStore.recentBooks)

const statusTag = {
  '在架': 'success',
  '借出': 'info',
  '维修中': 'warning',
  '逾期': 'danger',
}

const quickActions = [
  { label: '新增图书', to: '/books/new', iconPath: 'M12 5v14M5 12h14' },
  { label: '图书列表', to: '/books', iconPath: 'M4 6h16M4 12h16M4 18h10' },
  { label: '借阅记录', to: '/records', iconPath: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
]

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

// 跳转统计卡片：带状态筛选则加分页参数，跳图书列表并自动筛选
const goStat = (s) => {
  if (s.status) {
    router.push({ path: s.to, query: { status: s.status } })
  } else {
    router.push(s.to)
  }
}

onMounted(() => {
  setTimeout(() => { loading.value = false }, 300)
})
</script>

<template>
  <div class="dashboard">
    <!-- 顶部欢迎条 -->
    <div class="welcome-bar">
      <div class="welcome-left">
        <h1 class="greeting">{{ greeting }}，{{ userStore.userName || '管理员' }} 👋</h1>
        <p class="subtitle">欢迎回到 BookAdmin 图书管理系统，今天也要加油哦！</p>
      </div>
      <div class="welcome-right">
        <span class="role-badge">{{ userStore.userRole || 'admin' }}</span>
      </div>
    </div>

    <!-- 统计卡片（6 张：两排 3 列，数据来自 book store） -->
    <el-row :gutter="16" class="stat-row" v-loading="loading">
      <el-col v-for="s in stats" :key="s.label" :xs="12" :sm="12" :md="8">
        <div class="stat-card" :class="`stat-${s.color}`" @click="goStat(s)">
          <div class="stat-icon">
            <svg v-if="s.icon === 'Reading'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
            <svg v-else-if="s.icon === 'CircleCheck'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <svg v-else-if="s.icon === 'Tickets'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M3 7v4a2 2 0 002 2 2 2 0 012 2v2a2 2 0 002 2h8a2 2 0 002-2v-2a2 2 0 012-2 2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"/><line x1="13" y1="5" x2="13" y2="19"/></svg>
            <svg v-else-if="s.icon === 'Tools'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
            <svg v-else-if="s.icon === 'Warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="26" height="26"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ s.value }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
          <el-icon class="stat-arrow"><ArrowRight /></el-icon>
        </div>
      </el-col>
    </el-row>

    <!-- 下半部分：最近图书 + 快捷操作 -->
    <el-row :gutter="16" class="content-row">
      <el-col :xs="24" :md="16">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="section-header">
              <span class="section-title">最近图书</span>
              <el-button link type="primary" @click="router.push('/books')">
                查看全部 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="recentBooks" stripe style="width: 100%">
            <el-table-column prop="title" label="书名" min-width="160">
              <template #default="{ row }">
                <span class="book-title">{{ row.title }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" min-width="120" />
            <el-table-column prop="status" label="状态" width="110" align="center">
              <template #default="{ row }">
                <el-tag :type="statusTag[row.status]" effect="light" round size="small">
                  {{ row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="8">
        <el-card shadow="never" class="section-card">
          <template #header>
            <span class="section-title">快捷操作</span>
          </template>
          <div class="action-list">
            <div
              v-for="a in quickActions"
              :key="a.label"
              class="action-item"
              @click="router.push(a.to)"
            >
              <div class="action-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
                  <path :d="a.iconPath"/>
                </svg>
              </div>
              <span class="action-label">{{ a.label }}</span>
              <el-icon class="action-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 20px; }

/* ========== 欢迎条 ========== */
.welcome-bar {
  background: linear-gradient(135deg, #1e40af 0%, #3b5fd4 100%);
  border-radius: 12px;
  padding: 24px 28px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(30, 64, 175, 0.25);
}
.greeting { font-size: 22px; font-weight: 700; margin: 0 0 6px; }
.subtitle { font-size: 14px; margin: 0; opacity: 0.85; }
.role-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ========== 统计卡片 ========== */
.stat-row { margin-bottom: 0 !important; }
.stat-row > .el-col { margin-bottom: 16px; }
.stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  cursor: pointer;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}
.stat-card:hover .stat-arrow {
  opacity: 1;
  transform: translateX(2px);
}
.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}
.stat-blue .stat-icon   { background: linear-gradient(135deg, #1e40af, #3b82f6); }
.stat-green .stat-icon  { background: linear-gradient(135deg, #059669, #10b981); }
.stat-info .stat-icon   { background: linear-gradient(135deg, #2563eb, #60a5fa); }
.stat-orange .stat-icon { background: linear-gradient(135deg, #d97706, #f59e0b); }
.stat-red .stat-icon    { background: linear-gradient(135deg, #dc2626, #f87171); }
.stat-purple .stat-icon { background: linear-gradient(135deg, #7c3aed, #8b5cf6); }

.stat-info { flex: 1; }
.stat-value { font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.1; }
.stat-label { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }
.stat-arrow {
  opacity: 0.35;
  color: var(--text-secondary);
  font-size: 16px;
  transition: opacity 0.2s, transform 0.2s;
}

/* ========== 下半部分 ========== */
.section-card { border-radius: 10px; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
.section-title { font-size: 15px; font-weight: 700; color: var(--text-primary); }
.book-title { font-weight: 500; color: var(--text-primary); }

/* ========== 快捷操作 ========== */
.action-list { display: flex; flex-direction: column; gap: 8px; }
.action-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 8px; cursor: pointer;
  transition: background 0.2s;
}
.action-item:hover { background: #f8fafc; }
.action-icon {
  width: 36px; height: 36px; border-radius: 8px;
  background: #eff6ff; color: var(--el-color-primary);
  display: flex; align-items: center; justify-content: center;
}
.action-label { flex: 1; font-size: 14px; color: var(--text-primary); font-weight: 500; }
.action-arrow { color: #cbd5e1; transition: transform 0.2s, color 0.2s; }
.action-item:hover .action-arrow { color: var(--el-color-primary); transform: translateX(2px); }
</style>