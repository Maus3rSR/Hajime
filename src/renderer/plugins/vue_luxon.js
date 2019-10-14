import VueLuxon from 'vue-luxon'

const VueLuxonPlugin = {
    install(Vue) {
        Vue.use(VueLuxon, {
            serverZone: 'utc',
            serverFormat: 'iso',
            clientZone: 'locale',
            clientFormat: 'locale',
            localeLang: null,
            localeFormat: {},
            diffForHumans: {},
            i18n: {}
        })
    }
}

export default VueLuxonPlugin