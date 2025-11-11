import { createApp } from 'vue'

// import 'virtual:uno.css'
import 'element-plus/theme-chalk/index.css'
import '../dist/el-dynamic-forms.css'

import src from '../src'

import App from './App.vue'

createApp(App).use(src).mount('#app')
