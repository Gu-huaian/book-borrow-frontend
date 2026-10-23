import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('../components/Layout.vue'),
    redirect: '/books',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'books',
        name: 'BookList',
        component: () => import('../views/BookList.vue'),
        meta: { title: '图书列表', requiresAuth: true },
      },
      {
        path: 'books/new',
        name: 'BookForm',
        component: () => import('../views/BookForm.vue'),
        meta: { title: '新增图书', requiresAuth: true },
      },
      {
        path: 'books/:id',
        name: 'BookDetail',
        component: () => import('../views/BookDetail.vue'),
        meta: { title: '图书详情', requiresAuth: true },
      },
      {
        path: 'records',
        name: 'BorrowRecord',
        component: () => import('../views/BorrowRecord.vue'),
        meta: { title: '借阅记录', requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

// 路由守卫：根据 requiresAuth 做登录校验
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('library_token')

  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && token) {
    next('/books')
  } else {
    next()
  }
})

export default router