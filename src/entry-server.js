import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createApp } from './main.js'

export async function render(url) {
  const { app } = createApp()
  const appHtml = await renderToString(app)
  
  return {
    title: '酒搭子',
    headMeta: '',
    preloadLinks: '',
    appHtml,
    appContext: {}
  }
}
