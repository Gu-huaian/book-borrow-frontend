<script setup>
import { computed } from 'vue'
import { useBorrowStore } from '@/stores/borrow'

const borrowStore = useBorrowStore()

const records = computed(() => borrowStore.records)

const statusType = {
  '借阅中': 'warning',
  '已归还': 'success',
  '已逾期': 'danger',
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span class="title">借阅记录</span>
        <span class="subtitle">共 {{ records.length }} 条记录</span>
      </div>
    </template>

    <el-table :data="records" stripe border style="width: 100%">
      <el-table-column prop="id" label="序号" width="70" align="center" />
      <el-table-column prop="bookTitle" label="书名" min-width="130" />
      <el-table-column prop="isbn" label="ISBN" width="170" align="center">
        <template #default="{ row }">
          <span class="isbn-text">{{ row.isbn || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="borrower" label="借阅人" width="110" align="center">
        <template #default="{ row }">
          <div class="reader-cell">
            <span class="reader-name">{{ row.borrower }}</span>
            <span class="reader-no">{{ row.borrowerNo || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="borrowNo" label="外借单号" width="100" align="center" />
      <el-table-column prop="borrowDate" label="借出日期" width="120" align="center" />
      <el-table-column prop="dueDate" label="应还日期" width="120" align="center" />
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
.isbn-text {
  font-variant-numeric: tabular-nums;
  color: var(--text-secondary);
  font-size: 13px;
}
.reader-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.4;
}
.reader-no {
  font-size: 12px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}
</style>