import './assets/main.css'
import setupFocusDirective from './directives/focus'
import setupPermissionDirective from './directives/permission'
import {
  createApp,
} from 'vue'
import {
  createPinia
} from 'pinia'

import App from './App.vue'
import router from './router'
import {
  initAntStyle
} from './utils/antStyle'
import dayjs from "dayjs"
import "dayjs/locale/zh-cn" // 👈 引入 dayjs 的中文
dayjs.locale("zh-cn") // 设置全局语言

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
initAntStyle(pinia)
app.use(router)
setupFocusDirective(app)
setupPermissionDirective(app)

// 挂载全局变量
app.config.globalProperties.$appName = __APP_NAME__
app.config.globalProperties.$appVersion = __APP_VERSION__

app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => {
      // console.log('✅ Service Worker 注册成功', reg)
    })
    .catch((err) => {
      console.error('❌ Service Worker 注册失败', err)
    })
}