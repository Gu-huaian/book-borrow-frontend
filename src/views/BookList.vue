<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'

const router = useRouter()
const route = useRoute()
const bookStore = useBookStore()

// 状态 Tab 选项（'' 表示全部）
const statusTabs = ['', '在架', '借出', '维修中', '逾期']

// 全部书
const allBooks = computed(() => bookStore.books)

// 当前激活的筛选状态（从 URL query 读，这样统计卡片跳转能自动选中对应 Tab）
const activeStatus = computed({
  get: () => route.query.status || '',
  set: (val) => {
    if (val) router.replace({ query: { status: val } })
    else router.replace({ query: {} })
  },
})

// 根据筛选状态过滤书目
const books = computed(() => {
  const status = route.query.status
  if (!status) return allBooks.value
  return allBooks.value.filter((b) => b.status === status)
})

const goAdd = () => router.push('/books/new')
const goDetail = (row) => router.push(`/books/${row.id}`)

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除《${row.title}》吗？`, '删除提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    bookStore.deleteBook(row.id)
    ElMessage.success('删除成功')
  } catch { /* 用户取消 */ }
}

// 归还：借出/逾期/维修中 → 恢复在架，清空借阅信息
const handleReturn = async (row) => {
  try {
    await ElMessageBox.confirm(`确定归还《${row.title}》吗？`, '归还确认', {
      confirmButtonText: '归还',
      cancelButtonText: '取消',
      type: 'info',
    })
    bookStore.returnBook(row.id)
    ElMessage.success(`已归还《${row.title}》`)
  } catch { /* 用户取消 */ }
}

const statusType = (status) =>
  status === '在架' ? 'success' : status === '借出' ? 'info' : status === '维修中' ? 'warning' : 'danger'
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="toolbar">
        <div class="title-area">
          <span class="card-title">图书管理</span>
          <span class="card-subtitle">共 {{ books.length }} 条记录</span>
        </div>
        <el-button type="primary" :icon="Plus" size="default" @click="goAdd">
          新增图书
        </el-button>
      </div>
    </template>

    <!-- 状态筛选 Tab -->
    <el-tabs v-model="activeStatus" class="status-tabs">
      <el-tab-pane
        v-for="t in statusTabs"
        :key="t"
        :label="t === '' ? `全部（${allBooks.length}）` : t"
        :name="t"
      />
    </el-tabs>

    <el-table :data="books" stripe border style="width: 100%">
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="title" label="书名" min-width="160">
        <template #default="{ row }">
          <span class="book-name">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" min-width="120" />
      <el-table-column prop="year" label="出版年份" width="110" align="center" />
      <el-table-column prop="category" label="分类" width="130" align="center">
        <template #default="{ row }">
          <el-tag effect="light" round>{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isbn" label="ISBN" width="170" align="center">
        <template #default="{ row }">
          <span class="isbn-text">{{ row.isbn || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" effect="light" round size="small">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="goDetail(row)">详情</el-button>
          <template v-if="row.status !== '在架'">
            <el-divider direction="vertical" />
            <el-button type="success" link @click="handleReturn(row)">归还</el-button>
          </template>
          <el-divider direction="vertical" />
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-area {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}
.card-subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
}
.book-name {
  font-weight: 500;
  color: var(--text-primary);
}
.isbn-text {
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  font-size: 13px;
}
.status-tabs {
  margin-bottom: 4px;
}
</style>