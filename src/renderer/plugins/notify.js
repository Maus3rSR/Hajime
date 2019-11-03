import Toasted from 'vue-toasted'

const getIconClass = icon => 'mr-2 zmdi zmdi-'+icon

const infoToastOption = {
    type : 'info',
    duration : 8000,
    icon : getIconClass('info-outline'),
    closeOnSwipe: true,
}

const NotifyPlugin = {
    install(Vue) {
        Vue.use(Toasted, {
            position: 'bottom-right',
            duration: 3000,
            iconPack: "custom-class",
        })

        Vue.toasted.register('error', payload => payload, {
            type : 'error',
            duration : 8000,
            closeOnSwipe: true,
            icon : getIconClass('alert-circle-o'),
            action : {
                icon : getIconClass('close-circle-o'),
                onClick : (e, toastObject) => toastObject.goAway(0)
            },
        })

        Vue.toasted.register('success', payload => payload, {
            type : 'success',
            icon : getIconClass('check')
        })

        Vue.toasted.register('info', payload => payload, {
            ...infoToastOption,
            action : [{
                text: 'OK',
                onClick : (e, toastObject) => toastObject.goAway(0)
            }]
        })

        Vue.notify = Vue.prototype.$notify = {
            getOption: type => {
                switch (type) {
                    case "info":
                        return infoToastOption
                        break
                    default:
                        return undefined
                        break
                }
            },
            show: Vue.toasted.show,
            success: msg => Vue.toasted.global.success(msg),
            error: msg => Vue.toasted.global.error(msg),
            info: msg => Vue.toasted.global.info(msg)
        }
    }
}

export default NotifyPlugin