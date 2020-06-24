import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@lang/gb'
// import axios from 'axios'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: "gb",
    fallbackLocale: "gb",
    silentFallbackWarn: true,
    messages: { gb: messages }
})

export default i18n

const loadedLanguages = ['gb'] // our default language that is preloaded

function setI18nLanguage(lang) {
    i18n.locale = lang
    // axios.defaults.headers.common['Accept-Language'] = lang
    // document.querySelector('html').setAttribute('lang', lang)
    return lang
}

export function loadLanguageAsync(lang) {
    if (null === lang || undefined === lang) return

    if (i18n.locale === lang)
        return Promise.resolve(setI18nLanguage(lang))

    if (loadedLanguages.includes(lang))
        return Promise.resolve(setI18nLanguage(lang))

    return import(`@lang/${lang}.js`).then(
        messages => {
            console.log(lang, messages.default)
            i18n.setLocaleMessage(lang, messages.default)
            loadedLanguages.push(lang)
            return setI18nLanguage(lang)
        }
    )
}