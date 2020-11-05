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

export const langList = { "gb": "English", "fr": "Français" } // TODO: .env

export function setupVueI18nMessages(...args) {
    args.forEach(localeObject => Object.keys(langList).forEach(iso => i18n.mergeLocaleMessage(iso, localeObject[iso])))
    return i18n
}

export function setLanguage(lang) {
    if (null === lang || undefined === lang) return

    i18n.locale = lang

    return lang
}