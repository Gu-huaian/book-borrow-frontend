<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/book'

const route = useRoute()
const router = useRouter()
const bookStore = useBookStore()

const book = computed(() => bookStore.getBookById(route.params.id))

const goBack = () => router.push('/books')
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span class="title">图书详情</span>
      </div>
    </template>

    <div v-if="!book">
      <el-empty description="未找到该图书">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </el-empty>
    </div>

    <template v-else>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="书名">{{ book.title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ book.author }}</el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-tag effect="light" round>{{ book.category }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="出版年份">{{ book.year }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            :type="book.status === '在架' ? 'success' : book.status === '借出' ? 'info' : 'warning'"
            effect="light" round
          >{{ book.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="ISBN">
          {{ book.isbn || '-' }}
        </el-descriptions-item>

        <!-- 借出 / 逾期 时展示借阅信息 -->
        <template v-if="book.status === '借出' || book.status === '逾期'">
          <el-descriptions-item label="借阅人">{{ book.borrower || '-' }}</el-descriptions-item>
          <el-descriptions-item label="借阅号">{{ book.borrowerNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="外借单号">{{ book.borrowNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="借出日期">{{ book.borrowDate || '-' }}</el-descriptions-item>
        </template>

        <el-descriptions-item label="简介" :span="2">
          {{ book.description || '暂无简介' }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="footer">
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </template>
  </el-card>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}
.footer {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}
</style>