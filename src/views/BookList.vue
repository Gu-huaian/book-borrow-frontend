<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Check } from '@element-plus/icons-vue'
import { getBooks, addBook, updateBook, deleteBook } from '@/api/books'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()

// ===== 列表数据（来自后端分页接口） =====
const books = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = 2 // 与 mock 固定分页一致

const loadBooks = async () => {
  const res = await getBooks(page.value) // 返回 { code, data: { list, total } }
  books.value = res.data.list || []
  total.value = res.data.total || 0
}
onMounted(loadBooks)

// 状态 Tab 选项（'' 表示全部）
const statusTabs = ['', '在架', '借出', '维修中', '逾期']

// 当前激活筛选状态（从 URL query 读）
const activeStatus = computed({
  get: () => route.query.status || '',
  set: (val) => {
    if (val) router.replace({ query: { status: val } })
    else router.replace({ query: {} })
  },
})

// 根据筛选状态过滤当前页
const filteredBooks = computed(() => {
  const status = route.query.status
  if (!status) return books.value
  return books.value.filter((b) => b.status === status)
})

const goDetail = (row) => router.push(`/books/${row.id}`)

// ===== 新增/编辑弹窗 =====
const dialogVisible = ref(false)
const editingId = ref(null) // 为空表示新增
const formRef = ref()
const submitting = ref(false)

const form = reactive({ title: '', author: '', category: '', year: 2024, isbn: '' })
const categoryOptions = ['古典文学', '科幻小说', '当代文学', '历史传记', '经济管理']
const rules = {
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  year: [
    { required: true, message: '请输入出版年份', trigger: 'blur' },
    { type: 'number', min: 1900, max: 2100, message: '年份应在 1900 ~ 2100', trigger: 'blur' },
  ],
}

// 打开新增弹窗：清空表单
const openAdd = () => {
  editingId.value = null
  formRef.value?.resetFields()
  Object.assign(form, { title: '', author: '', category: '', year: 2024, isbn: '' })
  dialogVisible.value = true
}

// 打开编辑弹窗：回填当前行数据
const openEdit = (row) => {
  editingId.value = row.id
  Object.assign(form, {
    title: row.title,
    author: row.author,
    category: row.category,
    year: row.year,
    isbn: row.isbn,
  })
  dialogVisible.value = true
}

// 提交：新增或编辑，成功后刷新列表
const handleSubmit = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (editingId.value) {
      await updateBook(editingId.value, { ...form })
      ElMessage.success('编辑成功')
    } else {
      await addBook({ ...form })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    page.value = 1
    await loadBooks()
  } catch (e) {
    ElMessage.error(e?.message || '保存失败')
  } finally {
    submitting.value = false
  }
}

// ===== 删除 =====
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除《${row.title}》吗？`, '删除提示', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    await deleteBook(row.id)
    ElMessage.success('删除成功')
    await loadBooks()
  } catch { /* 用户取消 */ }
}

// ===== 触发后端 500，观察响应拦截器提示 =====
const handleBoom = async () => {
  try {
    await request.get('/boom') // 命中定义好的 500 接口，由拦截器统一提示
  } catch { /* 拦截器已提示“服务器错误” */ }
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
          <span class="card-subtitle">共 {{ total }} 条记录</span>
        </div>
        <div class="action-group">
          <el-button type="danger" plain @click="handleBoom">测试500</el-button>
          <el-button type="primary" :icon="Plus" @click="openAdd">新增图书</el-button>
        </div>
      </div>
    </template>

    <!-- 状态筛选 Tab -->
    <el-tabs v-model="activeStatus" class="status-tabs">
      <el-tab-pane
        v-for="t in statusTabs"
        :key="t"
        :label="t === '' ? `全部（${total}）` : t"
        :name="t"
      />
    </el-tabs>

    <el-table :data="filteredBooks" stripe border style="width: 100%">
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
      <el-table-column label="操作" width="220" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="goDetail(row)">详情</el-button>
          <el-divider direction="vertical" />
          <el-button type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页：page=2 时 mock 返回空数据处理 -->
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next, total"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
        @current-change="loadBooks"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑图书' : '新增图书'"
      width="480px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="书名" prop="title">
          <el-input v-model="form.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="出版年份" prop="year">
          <el-input-number v-model="form.year" :min="1900" :max="2100" controls-position="right" />
        </el-form-item>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="form.isbn" placeholder="请输入 ISBN" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          <el-icon style="margin-right: 4px"><Check /></el-icon>保存
        </el-button>
      </template>
    </el-dialog>
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
.action-group {
  display: flex;
  gap: 8px;
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
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>