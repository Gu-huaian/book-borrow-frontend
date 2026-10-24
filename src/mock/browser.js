import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 注册 MSW 浏览器 worker，传入所有 mock 接口
export const worker = setupWorker(...handlers)