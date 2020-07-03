import Vue from 'vue'
import VueI18n from 'vue-i18n'
// import axios from 'axios'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: process.env.ELECTRON_WEBPACK_APP_LOCALE_DEFAULT,
    fallbackLocale: process.env.ELECTRON_WEBPACK_APP_LOCALE_FALLBACK,
    silentFallbackWarn: true,
})

export default i18n

export function setLanguage(lang) {
    if (null === lang || undefined === lang) return

    i18n.locale = lang
    // axios.defaults.headers.common['Accept-Language'] = lang
    // document.querySelector('html').setAttribute('lang', lang)
    return lang
}