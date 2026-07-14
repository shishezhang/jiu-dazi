import { createSSRApp } from 'vue'
import App from './App.vue'

// 引用 uni-app 的页面配置
import pagesJson from './pages.json'

export function createApp() {
  const app = createSSRApp(App)
  
  app.config.errorHandler = (err, vm, info) => {
    console.error('[酒搭子] 错误:', err, info)
  }
  
  return { app }
}
