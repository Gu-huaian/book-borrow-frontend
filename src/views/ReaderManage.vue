<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Phone, Message } from '@element-plus/icons-vue'
import { useReaderStore } from '@/stores/reader'

const readerStore = useReaderStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const editNo = ref('')

// 新增 / 编辑表单（借阅号自动生成，无需手填）
const form = reactive({
  name: '',
  phone: '',
  email: '',
  level: '普通会员',
})

// 预览即将生成的借阅号
const previewNo = ref('')

const openAdd = () => {
  isEdit.value = false
  form.name = ''
  form.phone = ''
  form.email = ''
  form.level = '普通会员'
  previewNo.value = readerStore.nextNo()  // 自动生成新借阅号
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除借阅人 ${row.name}（${row.no}）吗？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
    readerStore.deleteReader(row.no)
    ElMessage.success('已删除')
  } catch { /* 用户取消 */ }
}

const handleSubmit = () => {
  if (!form.name.trim()) {
    ElMessage.warning('请输入姓名')
    return
  }
  readerStore.addReader({ ...form })
  dialogVisible.value = false
  ElMessage.success(`已新增借阅人 ${form.name}，借阅号 ${previewNo.value}`)
}
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="toolbar">
        <div class="title-area">
          <span class="card-title">借阅人管理</span>
          <span class="card-subtitle">共 {{ readerStore.readers.length }} 位借阅人</span>
        </div>
        <el-button type="primary" :icon="Plus" @click="openAdd">新增借阅人</el-button>
      </div>
    </template>

    <el-table :data="readerStore.readers" stripe border style="width: 100%">
      <el-table-column prop="no" label="借阅号" width="110" align="center" />
      <el-table-column prop="name" label="姓名" min-width="110" align="center" />
      <el-table-column prop="phone" label="手机号" min-width="140" align="center">
        <template #default="{ row }">
          <span class="muted">{{ row.phone || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="180" align="center">
        <template #default="{ row }">
          <span class="muted">{{ row.email || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="会员等级" width="130" align="center">
        <template #default="{ row }">
          <el-tag :type="row.level === '金牌会员' ? 'warning' : 'info'" effect="light" round>
            {{ row.level }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增借阅人弹窗：填个人信息，借阅号自动生成 -->
    <el-dialog v-model="dialogVisible" title="新增借阅人" width="460px">
      <el-form label-width="80px" size="large">
        <el-form-item label="借阅号">
          <el-input :model-value="previewNo" disabled>
            <template #append>
              <el-tag type="success" effect="light">自动生成</el-tag>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" placeholder="请输入手机号">
            <template #prefix><el-icon><Phone /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" placeholder="请输入邮箱">
            <template #prefix><el-icon><Message /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item label="会员等级">
          <el-select v-model="form.level" style="width: 100%">
            <el-option label="普通会员" value="普通会员" />
            <el-option label="金牌会员" value="金牌会员" />
            <el-option label="钻石会员" value="钻石会员" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :icon="Plus" @click="handleSubmit">确认新增</el-button>
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
.card-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
}
.card-subtitle {
  font-size: 13px;
  color: var(--text-tertiary);
}
.muted {
  color: var(--text-secondary);
}
</style>