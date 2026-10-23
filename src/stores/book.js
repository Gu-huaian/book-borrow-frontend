import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const now = new Date()
const y = now.getFullYear()
const m = now.getMonth()

const pad = (n) => String(n).padStart(2, '0')
const d = (day) => `${y}-${pad(m + 1)}-${pad(day)}`

const INITIAL_BOOKS = [
  { id: 1, title: '红楼梦', author: '曹雪芹', category: '古典文学', year: 2008, status: '在架', isbn: '978-7-02-000220-7', description: '中国古典四大名著之首，讲述贾、史、王、薛四大家族的兴衰。', createdAt: d(10) },
  { id: 2, title: '三体', author: '刘慈欣', category: '科幻小说', year: 2008, status: '借出', isbn: '978-7-5366-9293-0', description: '一部震撼人心的科幻巨著，探讨人类文明与宇宙的关系。', createdAt: d(12), borrower: '王小明', borrowerNo: 'BH-001', borrowNo: 'BR-001', borrowDate: d(12) },
  { id: 3, title: '活着', author: '余华', category: '当代文学', year: 2012, status: '借出', isbn: '978-7-5063-6543-7', description: '讲述一个人一生的故事，历尽世间沧桑和磨难的老人的人生感言。', createdAt: d(15), borrower: '李丽', borrowerNo: 'BH-002', borrowNo: 'BR-002', borrowDate: d(15) },
  { id: 4, title: '百年孤独', author: '加西亚·马尔克斯', category: '当代文学', year: 2011, status: '维修中', isbn: '978-7-5442-4528-7', description: '魔幻现实主义文学的代表作，描写布恩迪亚家族七代人的传奇故事。', createdAt: d(5) },
  { id: 5, title: '西游记', author: '吴承恩', category: '古典文学', year: 2010, status: '在架', isbn: '978-7-02-000222-4', description: '中国古典四大名著之一，讲述唐僧师徒西天取经的故事。', createdAt: d(18) },
  { id: 6, title: '三国演义', author: '罗贯中', category: '古典文学', year: 2009, status: '在架', isbn: '978-7-02-000216-6', description: '中国古典四大名著之一，描写东汉末年群雄割据的历史故事。', createdAt: d(20) },
  { id: 7, title: '围城', author: '钱钟书', category: '当代文学', year: 2010, status: '在架', isbn: '978-7-5063-1618-2', description: '以方鸿渐的生活为主线，描写抗战时期中国知识分子的群相。', createdAt: d(22) },
  { id: 8, title: '沙丘', author: '弗兰克·赫伯特', category: '科幻小说', year: 2013, status: '借出', isbn: '978-7-5499-4222-9', description: '科幻文学史上最伟大的作品之一，构建了一个庞大的沙丘宇宙。', createdAt: d(23), borrower: '张伟', borrowerNo: 'BH-003', borrowNo: 'BR-003', borrowDate: d(23) },
  { id: 9, title: '万历十五年', author: '黄仁宇', category: '历史传记', year: 2011, status: '逾期', isbn: '978-7-1080-2929-1', description: '以1587年为切入点，分析明代社会制度与文化的深层矛盾。', createdAt: d(2), borrower: '赵敏', borrowerNo: 'BH-004', borrowNo: 'BR-004', borrowDate: d(-20) },
  { id: 10, title: '穷查理宝典', author: '查理·芒格', category: '经济管理', year: 2016, status: '在架', isbn: '978-7-5086-4980-3', description: '收录了查理·芒格最著名的演讲和文章，展示其投资智慧和人生哲学。', createdAt: d(8) },
  { id: 11, title: '明朝那些事儿', author: '当年明月', category: '历史传记', year: 2006, status: '在架', isbn: '978-7-5057-2426-0', description: '以史料为基础，用通俗幽默的笔法讲述了明朝三百年间的历史故事。', createdAt: d(21) },
  { id: 12, title: '原则', author: '瑞·达利欧', category: '经济管理', year: 2018, status: '维修中', isbn: '978-7-5086-8753-0', description: '桥水基金创始人分享其生活和工作的原则。', createdAt: d(1) },
]

export const useBookStore = defineStore(
  'book',
  () => {
    const books = ref([...INITIAL_BOOKS])
    const loading = ref(false)

    const totalCount = computed(() => books.value.length)
    const availableCount = computed(() => books.value.filter((b) => b.status === '在架').length)
    const borrowedCount = computed(() => books.value.filter((b) => b.status === '借出').length)
    const repairingCount = computed(() => books.value.filter((b) => b.status === '维修中').length)
    const overdueCount = computed(() => books.value.filter((b) => b.status === '逾期').length)

    const monthlyNew = computed(() => {
      const now = new Date()
      const y = now.getFullYear()
      const m = now.getMonth()
      return books.value.filter((b) => {
        const d = new Date(b.createdAt)
        return d.getFullYear() === y && d.getMonth() === m
      }).length
    })

    const stats = computed(() => [
      { label: '图书总数', value: totalCount.value, icon: 'Reading', color: 'blue', to: '/books' },
      { label: '在架可借阅', value: availableCount.value, icon: 'CircleCheck', color: 'green', to: '/books', status: '在架' },
      { label: '借阅中', value: borrowedCount.value, icon: 'Tickets', color: 'info', to: '/books', status: '借出' },
      { label: '维修中', value: repairingCount.value, icon: 'Tools', color: 'orange', to: '/books', status: '维修中' },
      { label: '已逾期', value: overdueCount.value, icon: 'Warning', color: 'red', to: '/books', status: '逾期' },
      { label: '本月新增', value: monthlyNew.value, icon: 'TrendCharts', color: 'purple', to: '/books/new' },
    ])

    const recentBooks = computed(() =>
      [...books.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
    )

    const getBookById = (id) => books.value.find((b) => String(b.id) === String(id)) || null

    const addBook = (form) => {
      const newBook = {
        id: Date.now(),
        status: '在架',
        description: '',
        createdAt: new Date().toISOString().slice(0, 10),
        ...form,
      }
      books.value.unshift(newBook)
      return newBook
    }

    const deleteBook = (id) => {
      books.value = books.value.filter((b) => b.id !== id)
    }

    const updateBook = (id, patch) => {
      const idx = books.value.findIndex((b) => b.id === id)
      if (idx !== -1) {
        books.value[idx] = { ...books.value[idx], ...patch }
      }
    }

    // 在架（可被借阅或送修）的书
    const availableBooks = computed(() =>
      books.value.filter((b) => b.status === '在架')
    )

    // 借出登记：把一本书设为借出，并记录借阅人、借书号、ISBN、借出日期
    const borrowBook = (id, { borrower, borrowerNo, borrowNo, borrowDate }) => {
      const b = getBookById(id)
      if (!b) return
      b.status = '借出'
      b.borrower = borrower
      b.borrowerNo = borrowerNo
      b.borrowNo = borrowNo
      b.borrowDate = borrowDate
    }

    // 维修登记：把一本书设为维修中
    const repairBook = (id) => {
      const b = getBookById(id)
      if (!b) return
      b.status = '维修中'
    }

    // 归还登记：把一本书恢复为在架，清空借阅信息
    const returnBook = (id) => {
      const b = getBookById(id)
      if (!b) return
      b.status = '在架'
      b.borrower = ''
      b.borrowNo = ''
      b.borrowDate = ''
    }

    return {
      books, loading,
      totalCount, availableCount, borrowedCount, repairingCount, overdueCount, monthlyNew,
      stats, recentBooks, availableBooks,
      getBookById, addBook, deleteBook, updateBook, borrowBook, repairBook, returnBook,
    }
  },
  { persist: true }
)