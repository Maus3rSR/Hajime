import Toasted from 'vue-toasted'

const getIconClass = icon => 'mr-2 zmdi zmdi-'+icon

const NotifyPlugin = {
    install(Vue) {
        Vue.use(Toasted, {
            position: 'bottom-right',
            duration: 3000,
            iconPack: "custom-class",
        })

        Vue.toasted.register('error', payload => payload, {
            type : 'error',
            icon : getIconClass('alert-circle-o')
        })

        Vue.toasted.register('success', payload => payload, {
            type : 'success',
            icon : getIconClass('check')
        })

        Vue.toasted.register('info', payload => payload, {
            type : 'info',
            icon : getIconClass('alert-circle-o')
        })

        Vue.notify = Vue.prototype.$notify = {
            success: msg => Vue.toasted.global.success(msg),
            error: msg => Vue.toasted.global.error(msg),
            info: msg => Vue.toasted.global.info(msg)
        }
    }
}

export default NotifyPlugin