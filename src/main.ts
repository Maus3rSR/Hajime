import { createApp } from 'vue'
import Main from '/apps/Main.vue'
import Router from '/config/router.ts'

createApp(Main).use(Router).mount('#app')
