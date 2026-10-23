<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

const books = ref([])
const loading = ref(true)

onMounted(() => {
  setTimeout(() => {
    books.value = [
      { id: 1, title: '红楼梦', author: '曹雪芹', category: '古典文学', year: 2008 },
      { id: 2, title: '三体', author: '刘慈欣', category: '科幻小说', year: 2008 },
      { id: 3, title: '活着', author: '余华', category: '当代文学', year: 2012 },
      { id: 4, title: '百年孤独', author: '加西亚·马尔克斯', category: '当代文学', year: 2011 },
      { id: 5, title: '西游记', author: '吴承恩', category: '古典文学', year: 2010 },
    ]
    loading.value = false
  }, 400)
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
    books.value = books.value.filter((b) => b.id !== row.id)
    ElMessage.success('删除成功')
  } catch { /* 用户取消 */ }
}
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

    <el-table :data="books" stripe border v-loading="loading" style="width: 100%">
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
      <el-table-column label="操作" width="160" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="goDetail(row)">详情</el-button>
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
</style>