import { createApp } from 'vue'

import 'uno.css'
import 'element-plus/theme-chalk/index.css'

import src from '../src'

import App from './App.vue'

createApp(App).use(src).mount('#app')
