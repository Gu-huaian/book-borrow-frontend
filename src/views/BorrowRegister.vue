<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Refresh, Search, Right } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'
import { useReaderStore } from '@/stores/reader'
import { useBorrowStore } from '@/stores/borrow'

const router = useRouter()
const bookStore = useBookStore()
const readerStore = useReaderStore()
const borrowStore = useBorrowStore()

const form = reactive({
  isbn: '',
  bookNo: '',
})

// 书名搜索（用于反向确定 ISBN）
const titleKeyword = ref('')

const matchedBook = ref(null)      // 当前匹配到的书籍
const bookError = ref('')
const matchedReader = ref(null)    // 匹配到的借阅人
const readerError = ref('')

// 书名关键词变化 → 返回过滤出的建议（必须返回 Promise）
const onTitleSearch = (query) => {
  const kw = (query || '').trim().toLowerCase()
  if (!kw) return Promise.resolve([])
  const list = bookStore.books
    .filter((b) => b.title.toLowerCase().includes(kw) || (b.author || '').toLowerCase().includes(kw))
    .slice(0, 6)
  return Promise.resolve(list)
}

// 选中书名建议 → 确定 ISBN，并更新书名关键词
const onTitleSelect = (suggestion) => {
  matchedBook.value = suggestion
  form.isbn = suggestion.isbn
  bookError.value = ''
}

// 输入 ISBN → 反查书名，自动回填书名关键词
const onIsbnInput = () => {
  const isbn = form.isbn.trim()
  if (!isbn) {
    matchedBook.value = null
    bookError.value = ''
    return
  }
  const b = bookStore.books.find((x) => x.isbn === isbn)
  if (b) {
    matchedBook.value = b
    titleKeyword.value = b.title
    bookError.value = ''
  } else {
    matchedBook.value = null
    bookError.value = '未找到该 ISBN 对应的图书'
  }
}

// 输入借书号 → 反查借阅人姓名
const onBookNoInput = () => {
  const no = form.bookNo.trim()
  if (!no) {
    matchedReader.value = null
    readerError.value = ''
    return
  }
  const r = readerStore.getByNo(no)
  if (r) {
    matchedReader.value = r
    readerError.value = ''
  } else {
    matchedReader.value = null
    readerError.value = '未找到该借书号对应的借阅人'
  }
}

const today = () => new Date().toISOString().slice(0, 10)

const submitting = ref(false)

const handleSubmit = () => {
  if (!matchedBook.value) {
    ElMessage.warning('请先通过书名或 ISBN 确定图书')
    return
  }
  if (!matchedReader.value) {
    ElMessage.warning('请输入正确的借书号')
    return
  }
  submitting.value = true
  setTimeout(() => {
    const borrowNo = `BR-${String(Date.now()).slice(-4)}`
    bookStore.borrowBook(matchedBook.value.id, {
      borrower: matchedReader.value.name,
      borrowerNo: matchedReader.value.no,
      borrowNo,
      borrowDate: today(),
    })
    borrowStore.addRecord({
      bookTitle: matchedBook.value.title,
      borrower: matchedReader.value.name,
      borrowerNo: matchedReader.value.no,
      isbn: matchedBook.value.isbn,
      borrowNo,
      borrowDate: today(),
    })
    submitting.value = false
    ElMessage.success(`已登记借出《${matchedBook.value.title}》给 ${matchedReader.value.name}`)
    router.push('/books')
  }, 300)
}

const handleReset = () => {
  form.isbn = ''
  form.bookNo = ''
  titleKeyword.value = ''
  matchedBook.value = null
  matchedReader.value = null
  bookError.value = ''
  readerError.value = ''
}
const handleCancel = () => router.push('/books')
</script>

<template>
  <el-card shadow="never" class="form-card">
    <template #header>
      <div class="header">
        <span class="title">新增借阅登记</span>
        <span class="subtitle">搜索书名或输入 ISBN 确定图书，输入借书号确定借阅人</span>
      </div>
    </template>

    <el-form label-width="110px" label-position="right" size="large" class="book-form">
      <!-- ① 搜索书名 → 确定 ISBN（下拉提示） -->
      <el-form-item label="搜索书名">
        <el-autocomplete
          v-model="titleKeyword"
          :fetch-suggestions="onTitleSearch"
          :trigger-on-focus="false"
          placeholder="输入书名或作者，选择后自动确定 ISBN"
          clearable
          style="width: 100%"
          @select="onTitleSelect"
        >
          <template #default="{ item }">
            <div class="book-suggest">
              <span class="s-name">{{ item.title }}</span>
              <span class="s-meta">{{ item.author }} · {{ item.isbn }}</span>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>

      <!-- ② 输入 ISBN → 反查书名 -->
      <el-form-item label="图书 ISBN">
        <el-input
          v-model="form.isbn"
          placeholder="或直接输入 ISBN"
          clearable
          @input="onIsbnInput"
        />
        <div v-if="matchedBook" class="match-hint success">
          匹配到：<b>{{ matchedBook.title }}</b>（{{ matchedBook.author }}）
        </div>
        <div v-else-if="bookError" class="match-hint error">{{ bookError }}</div>
      </el-form-item>

      <!-- ③ 输入借书号 → 反查借阅人 -->
      <el-form-item label="借书号">
        <el-input
          v-model="form.bookNo"
          placeholder="请输入借阅人借书号，如 BH-001"
          clearable
          @input="onBookNoInput"
        />
        <div v-if="matchedReader" class="match-hint success">
          借阅人：<b>{{ matchedReader.name }}</b>（{{ matchedReader.phone || '未留电话' }}）
        </div>
        <div v-else-if="readerError" class="match-hint error">{{ readerError }}</div>
        <div v-else class="to-readers">
          <el-link type="primary" :icon="Right" @click="router.push('/readers')">
            去借阅人管理新增借阅人
          </el-link>
        </div>
      </el-form-item>

      <!-- 已确定信息预览 -->
      <div v-if="matchedBook && matchedReader" class="summary">
        <div class="summary-row">
          <el-tag type="success" effect="light" round>《{{ matchedBook.title }}》</el-tag>
          <el-icon><Search /></el-icon>
          <el-tag type="info" effect="light" round>{{ matchedReader.name }}</el-tag>
        </div>
        <div class="summary-row muted-text">
          ISBN：{{ matchedBook.isbn }} · 借阅人 {{ matchedReader.no }}
        </div>
      </div>

      <el-form-item>
        <div class="btn-group">
          <el-button type="primary" :icon="Check" :loading="submitting" @click="handleSubmit">
            确认借出
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.form-card {
  max-width: 680px;
  margin: 0 auto;
}
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
.book-form {
  max-width: 560px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}
.match-hint {
  width: 100%;
  font-size: 13px;
  margin-top: 6px;
}
.match-hint.success {
  color: #059669;
}
.match-hint.error {
  color: #dc2626;
}
.to-readers {
  width: 100%;
  margin-top: 6px;
}
.book-suggest {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  padding: 2px 0;
}
.s-name {
  font-weight: 600;
  color: var(--text-primary);
}
.s-meta {
  font-size: 12px;
  color: var(--text-secondary);
}
.summary {
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  padding: 14px 16px;
  margin: 4px 0 20px 0;
  background: #f8fafc;
}
.summary-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.muted-text {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>