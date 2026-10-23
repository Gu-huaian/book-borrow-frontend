<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const bookId = route.params.id
const loading = ref(true)
const book = ref(null)

const mockBooks = [
  { id: 1, title: '红楼梦', author: '曹雪芹', category: '古典文学', year: 2008, description: '中国古典四大名著之首，讲述贾、史、王、薛四大家族的兴衰。' },
  { id: 2, title: '三体', author: '刘慈欣', category: '科幻小说', year: 2008, description: '一部震撼人心的科幻巨著，探讨人类文明与宇宙的关系。' },
  { id: 3, title: '活着', author: '余华', category: '当代文学', year: 2012, description: '讲述一个人一生的故事，历尽世间沧桑和磨难的老人的人生感言。' },
  { id: 4, title: '百年孤独', author: '加西亚·马尔克斯', category: '当代文学', year: 2011, description: '魔幻现实主义文学的代表作，描写布恩迪亚家族七代人的传奇故事。' },
  { id: 5, title: '西游记', author: '吴承恩', category: '古典文学', year: 2010, description: '中国古典四大名著之一，讲述唐僧师徒西天取经的故事。' },
]

onMounted(() => {
  setTimeout(() => {
    book.value = mockBooks.find((b) => String(b.id) === String(bookId)) || null
    loading.value = false
  }, 300)
})

const goBack = () => router.push('/books')
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span class="title">图书详情</span>
      </div>
    </template>

    <!-- 加载中 -->
    <div v-if="loading" class="loading-box">
      <el-icon class="is-loading" :size="28" color="#1e40af"><Loading /></el-icon>
      <p>加载中...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!book">
      <el-empty description="未找到该图书">
        <el-button type="primary" @click="goBack">返回列表</el-button>
      </el-empty>
    </div>

    <!-- 详情展示：带边框的描述列表（表头灰底） -->
    <template v-else>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="书名">{{ book.title }}</el-descriptions-item>
        <el-descriptions-item label="作者">{{ book.author }}</el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-tag effect="light" round>{{ book.category }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="出版年份">{{ book.year }}</el-descriptions-item>
        <el-descriptions-item label="简介" :span="2">
          {{ book.description }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 底部操作区 -->
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
.loading-box {
  padding: 60px 0;
  text-align: center;
  color: var(--text-tertiary);
}
.footer {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: center;
}
</style>