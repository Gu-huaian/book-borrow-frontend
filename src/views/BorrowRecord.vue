<script setup>
import { ref, onMounted } from 'vue'

const records = ref([])
const loading = ref(true)

const statusType = {
  '借阅中': 'warning',
  '已归还': 'success',
  '已逾期': 'danger',
}

onMounted(() => {
  setTimeout(() => {
    records.value = [
      { id: 1, bookTitle: '红楼梦', borrowDate: '2026-10-01', dueDate: '2026-11-01', status: '借阅中' },
      { id: 2, bookTitle: '三体', borrowDate: '2026-09-15', dueDate: '2026-10-15', status: '已归还' },
      { id: 3, bookTitle: '活着', borrowDate: '2026-10-10', dueDate: '2026-11-10', status: '借阅中' },
      { id: 4, bookTitle: '百年孤独', borrowDate: '2026-08-01', dueDate: '2026-09-01', status: '已逾期' },
    ]
    loading.value = false
  }, 400)
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span class="title">借阅记录</span>
        <span class="subtitle">共 {{ records.length }} 条记录</span>
      </div>
    </template>

    <el-table :data="records" stripe border v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="序号" width="70" align="center" />
      <el-table-column prop="bookTitle" label="书名" min-width="160">
        <template #default="{ row }">
          <span class="book-name">{{ row.bookTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="borrowDate" label="借出日期" width="140" align="center" />
      <el-table-column prop="dueDate" label="应还日期" width="140" align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType[row.status] || 'info'" effect="light" round>
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.header {
  display: flex;
  align-items: baseline;
  gap: 12px;
}
.title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}
.subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
}
.book-name {
  font-weight: 500;
  color: var(--text-primary);
}
</style>