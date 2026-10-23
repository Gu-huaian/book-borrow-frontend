<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Refresh } from '@element-plus/icons-vue'
import { useBookStore } from '@/stores/book'

const router = useRouter()
const bookStore = useBookStore()

// 只有"在架"的书可选送修
const options = computed(() =>
  bookStore.availableBooks.map((b) => ({
    value: b.id,
    label: `${b.title}（${b.author}）`,
  }))
)

const form = reactive({ bookId: '' })

const rules = {
  bookId: [{ required: true, message: '请选择要送修的图书', trigger: 'change' }],
}

const formRef = ref()
const submitting = ref(false)

const selectedBook = computed(() =>
  bookStore.books.find((b) => String(b.id) === String(form.bookId)) || null
)

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  setTimeout(() => {
    bookStore.repairBook(form.bookId)
    submitting.value = false
    ElMessage.success(`已将《${selectedBook.value.title}》送入维修`)
    router.push('/books')
  }, 400)
}

const handleReset = () => formRef.value.resetFields()
const handleCancel = () => router.push('/books')
</script>

<template>
  <el-card shadow="never" class="form-card">
    <template #header>
      <div class="header">
        <span class="title">新增维修登记</span>
        <span class="subtitle">选择图书并标记为维修中</span>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="110px"
      label-position="right"
      size="large"
      class="book-form"
    >
      <el-form-item label="送修图书" prop="bookId">
        <el-select
          v-model="form.bookId"
          placeholder="请选择在架图书"
          filterable
          style="width: 100%"
        >
          <el-option v-for="o in options" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="图书 ISBN">
        <el-input :model-value="selectedBook ? selectedBook.isbn : ''" placeholder="选择图书后自动显示" disabled />
      </el-form-item>

      <el-alert
        title="送修后该书将标记为「维修中」，无法被借阅，维修完成后可手动归还。"
        type="warning"
        :closable="false"
        show-icon
      />

      <el-form-item>
        <div class="btn-group">
          <el-button type="primary" :icon="Check" :loading="submitting" @click="handleSubmit">
            确认送修
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
  max-width: 520px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
}
.el-alert {
  margin-bottom: 20px;
}
</style>