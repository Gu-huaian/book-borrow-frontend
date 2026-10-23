import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INITIAL_RECORDS = [
  { id: 1, bookTitle: '三体', borrower: '王小明', borrowerNo: 'BH-001', isbn: '978-7-5366-9293-0', borrowNo: 'BR-001', borrowDate: '2026-10-01', dueDate: '2026-11-01', status: '借阅中' },
  { id: 2, bookTitle: '活着', borrower: '李丽', borrowerNo: 'BH-002', isbn: '978-7-5063-6543-7', borrowNo: 'BR-002', borrowDate: '2026-10-10', dueDate: '2026-11-10', status: '借阅中' },
  { id: 3, bookTitle: '沙丘', borrower: '张伟', borrowerNo: 'BH-003', isbn: '978-7-5499-4222-9', borrowNo: 'BR-003', borrowDate: '2026-10-15', dueDate: '2026-11-15', status: '借阅中' },
  { id: 4, bookTitle: '万历十五年', borrower: '赵敏', borrowerNo: 'BH-004', isbn: '978-7-1080-2929-1', borrowNo: 'BR-004', borrowDate: '2026-08-01', dueDate: '2026-09-01', status: '已逾期' },
  { id: 5, bookTitle: '红楼梦', borrower: '陈晨', borrowerNo: 'BH-005', isbn: '978-7-02-000220-7', borrowNo: 'BR-005', borrowDate: '2026-09-15', dueDate: '2026-10-15', status: '已归还' },
  { id: 6, bookTitle: '三国演义', borrower: '周舟', borrowerNo: 'BH-006', isbn: '978-7-02-000216-6', borrowNo: 'BR-006', borrowDate: '2026-07-20', dueDate: '2026-08-20', status: '已归还' },
]

export const useBorrowStore = defineStore(
  'borrow',
  () => {
    const records = ref([...INITIAL_RECORDS])

    const activeCount = computed(() => records.value.filter((r) => r.status === '借阅中').length)
    const overdueCount = computed(() => records.value.filter((r) => r.status === '已逾期').length)

    // 新增一条借阅记录（默认应还日期 = 借出日 + 30 天）
    const addRecord = ({ bookTitle, borrower, borrowerNo, isbn, borrowNo, borrowDate }) => {
      const due = new Date(borrowDate)
      due.setDate(due.getDate() + 30)
      const dueDate = due.toISOString().slice(0, 10)
      records.value.unshift({
        id: Date.now(),
        bookTitle,
        borrower,
        borrowerNo,
        isbn,
        borrowNo,
        borrowDate,
        dueDate,
        status: '借阅中',
      })
    }

    return { records, activeCount, overdueCount, addRecord }
  },
  { persist: true }
)