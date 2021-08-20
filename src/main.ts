import { createApp } from 'vue'
import Main from '/apps/Main.vue'
import Router from '/config/router.ts'
import Plugins from '/plugins'

createApp(Main).use(Router).use(Plugins).mount('#app')
