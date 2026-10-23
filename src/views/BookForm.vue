<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const form = reactive({
  title: '',
  author: '',
  category: '',
  year: 2024,
})

const categoryOptions = ['古典文学', '科幻小说', '当代文学', '历史传记', '经济管理']

const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  year: [
    { required: true, message: '请输入出版年份', trigger: 'blur' },
    { type: 'number', min: 1900, max: 2100, message: '年份应在 1900 ~ 2100 之间', trigger: 'blur' },
  ],
}

const formRef = ref()
const submitting = ref(false)

const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    ElMessage.success('新增图书成功')
    router.push('/books')
  }, 500)
}

const handleReset = () => formRef.value.resetFields()
const handleCancel = () => router.push('/books')
</script>

<template>
  <el-card shadow="never" class="form-card">
    <template #header>
      <div class="header">
        <span class="title">新增图书</span>
        <span class="subtitle">填写以下信息完成图书录入</span>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
      size="large"
      class="book-form"
    >
      <el-form-item label="书名" prop="title">
        <el-input v-model="form.title" placeholder="请输入书名" />
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author" placeholder="请输入作者姓名" />
      </el-form-item>

      <el-form-item label="分类" prop="category">
        <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
          <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
        </el-select>
      </el-form-item>

      <el-form-item label="出版年份" prop="year">
        <el-input-number
          v-model="form.year"
          :min="1900"
          :max="2100"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item>
        <div class="btn-group">
          <el-button type="primary" :icon="Check" :loading="submitting" @click="handleSubmit">
            提交
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
</style>