import { createApp } from 'vue'
import Main from '/apps/Main.vue'
import config from '/config'
import plugins from '/plugins'

createApp(Main).use(config).use(plugins).mount('#app')
