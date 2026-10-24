import { http, HttpResponse } from 'msw'

// 内存中的图书数据（模拟数据库）
const books = [
  { id: 1, title: '红楼梦', author: '曹雪芹', category: '古典文学', year: 2008, status: '在架', isbn: '978-7-02-000220-7', description: '中国古典四大名著之首', createdAt: '2025-10-10' },
  { id: 2, title: '三体', author: '刘慈欣', category: '科幻小说', year: 2008, status: '借出', isbn: '978-7-5366-9293-0', description: '震撼人心的科幻巨著', createdAt: '2025-10-12' },
  { id: 3, title: '活着', author: '余华', category: '当代文学', year: 2012, status: '在架', isbn: '978-7-5063-6543-7', description: '讲述一个人一生的故事', createdAt: '2025-10-15' },
]
let nextId = 4 // 自增主键

const PAGE_SIZE = 2 // 每页条数

export const handlers = [
  // 登录：返回 token 和用户信息
  http.post('/api/login', async ({ request }) => {
    const { username } = await request.json()
    const lower = (username || '').toLowerCase()
    const role = lower.includes('admin') ? 'admin' : lower.includes('librarian') ? 'librarian' : 'reader'
    return HttpResponse.json({
      code: 200,
      data: {
        token: 'mock_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        userInfo: { name: username, role },
      },
    })
  }),

  // 分页查询图书列表；page=2 时返回空数据
  http.get('/api/books', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)

    // 模拟第二页无更多数据
    if (page === 2) {
      return HttpResponse.json({ code: 200, data: { list: [], total: books.length, page, pageSize: PAGE_SIZE } })
    }

    const start = (page - 1) * PAGE_SIZE
    const list = books.slice(start, start + PAGE_SIZE)
    return HttpResponse.json({ code: 200, data: { list, total: books.length, page, pageSize: PAGE_SIZE } })
  }),

  // 新增图书
  http.post('/api/books', async ({ request }) => {
    const body = await request.json()
    const newBook = { id: nextId++, status: '在架', createdAt: new Date().toISOString().slice(0, 10), ...body }
    books.unshift(newBook)
    return HttpResponse.json({ code: 200, data: newBook }, { status: 201 })
  }),

  // 编辑图书
  http.put('/api/books/:id', async ({ request, params }) => {
    const patch = await request.json()
    const idx = books.findIndex((b) => String(b.id) === String(params.id))
    if (idx === -1) return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    books[idx] = { ...books[idx], ...patch }
    return HttpResponse.json({ code: 200, data: books[idx] })
  }),

  // 删除图书
  http.delete('/api/books/:id', ({ params }) => {
    const idx = books.findIndex((b) => String(b.id) === String(params.id))
    if (idx === -1) return HttpResponse.json({ message: '图书不存在' }, { status: 404 })
    books.splice(idx, 1)
    return HttpResponse.json({ code: 200, data: { success: true } })
  }),

  // 模拟服务器 500 错误（只返回状态码，不带响应体）
  http.get('/api/boom', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  // 需要 Authorization，否则返回 401
  http.get('/api/protected', ({ request }) => {
    const auth = request.headers.get('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return HttpResponse.json({ message: '未认证，请先登录' }, { status: 401 })
    }
    return HttpResponse.json({ secret: '受保护的数据' })
  }),
]