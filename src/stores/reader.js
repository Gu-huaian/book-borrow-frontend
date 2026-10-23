import { defineStore } from 'pinia'
import { ref } from 'vue'

// 借阅人（读者）数据：借阅号自动生成 + 个人信息
const INITIAL_READERS = [
  { no: 'BH-001', name: '王小明', phone: '13800000001', email: 'wang@example.com', level: '普通会员' },
  { no: 'BH-002', name: '李丽', phone: '13800000002', email: 'li@example.com', level: '普通会员' },
  { no: 'BH-003', name: '张伟', phone: '13800000003', email: 'zhang@example.com', level: '金牌会员' },
  { no: 'BH-004', name: '赵敏', phone: '13800000004', email: 'zhao@example.com', level: '普通会员' },
  { no: 'BH-005', name: '陈晨', phone: '13800000005', email: 'chen@example.com', level: '金牌会员' },
  { no: 'BH-006', name: '周舟', phone: '13800000006', email: 'zhou@example.com', level: '普通会员' },
]

export const useReaderStore = defineStore(
  'reader',
  () => {
    const readers = ref([...INITIAL_READERS])

    // 根据借阅号查借阅人
    const getByNo = (no) => readers.value.find((r) => r.no === no) || null

    // 自动生成下一个借阅号：BH-001、BH-002、BH-003 …
    const nextNo = () => {
      const nums = readers.value
        .map((r) => parseInt(r.no.replace('BH-', ''), 10))
        .filter((n) => !Number.isNaN(n))
      const max = nums.length ? Math.max(...nums) : 0
      return `BH-${String(max + 1).padStart(3, '0')}`
    }

    // 新增借阅人：只传个人信息，借阅号自动生成
    const addReader = ({ name, phone = '', email = '', level = '普通会员' }) => {
      const reader = { no: nextNo(), name, phone, email, level }
      readers.value.push(reader)
      return reader
    }

    // 删除借阅人
    const deleteReader = (no) => {
      readers.value = readers.value.filter((r) => r.no !== no)
    }

    return { readers, getByNo, nextNo, addReader, deleteReader }
  },
  { persist: true }
)