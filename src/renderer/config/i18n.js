import Vue from 'vue'
import VueI18n from 'vue-i18n'
import commonTranslations from '@lang/generic/common/messages'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: process.env.ELECTRON_WEBPACK_APP_LOCALE_DEFAULT,
    fallbackLocale: process.env.ELECTRON_WEBPACK_APP_LOCALE_FALLBACK,
    silentFallbackWarn: true,
    messages: commonTranslations
})

export default i18n

export const ISO_LOCALE_LIST = process.env.ELECTRON_WEBPACK_APP_LOCALE_LIST
    .split(",")
    .reduce((list, value) => {
        let iso, name
        [iso, name] = value.split(":")

        return { ...list, [iso]: name }
    }, {})

export function setupVueI18nMessages(...args) {
    args.forEach(localeObject => Object.keys(ISO_LOCALE_LIST).forEach(iso => i18n.mergeLocaleMessage(iso, localeObject[iso])))
    return i18n
}

export function setLanguage(lang) {
    if (null === lang || undefined === lang) return

    i18n.locale = lang

    return lang
}