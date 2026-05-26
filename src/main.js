import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { validateConfig } from './config'

const app = createApp(App)

// 验证配置完整性
validateConfig()

app.use(createPinia())
app.use(router)

app.mount('#app')
