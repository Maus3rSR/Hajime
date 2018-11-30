import Toasted from 'vue-toasted';

const NotifyPlugin = {
    install(Vue) {
        Vue.use(Toasted, {
            duration: 3000
        })

        Vue.toasted.register('error', payload => payload, {
            type : 'error',
            icon : 'error_outline'
        })

        Vue.toasted.register('success', payload => payload, {
            type : 'success',
            icon : 'check'
        })

        Vue.toasted.register('info', payload => payload, {
            type : 'info',
            icon : 'info_outline'
        })

        Vue.notify = Vue.prototype.$notify = {
            success: msg => Vue.toasted.global.success(msg),
            error: msg => Vue.toasted.global.error(msg),
            info: msg => Vue.toasted.global.info(msg)
        }
    }
}

export default NotifyPlugin;