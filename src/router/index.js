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
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页', requiresAuth: true },
      },
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
        path: 'borrow/new',
        name: 'BorrowRegister',
        component: () => import('../views/BorrowRegister.vue'),
        meta: { title: '新增借阅', requiresAuth: true },
      },
      {
        path: 'repair/new',
        name: 'RepairForm',
        component: () => import('../views/RepairForm.vue'),
        meta: { title: '新增维修', requiresAuth: true },
      },
      {
        path: 'readers',
        name: 'ReaderManage',
        component: () => import('../views/ReaderManage.vue'),
        meta: { title: '借阅人管理', requiresAuth: true },
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
// 注意：Pinia 必须在 app.use(pinia) 挂载后才能使用，
// main.js 里 pinia 在 router 之前挂载，所以这里可以安全调用
import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router