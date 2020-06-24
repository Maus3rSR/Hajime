import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@lang/en'
// import axios from 'axios'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: 'en', // set locale
    fallbackLocale: 'en',
    messages // set locale messages
})

export default i18n

const loadedLanguages = ['en'] // our default language that is preloaded

function setI18nLanguage(lang) {
    i18n.locale = lang
    // axios.defaults.headers.common['Accept-Language'] = lang
    // document.querySelector('html').setAttribute('lang', lang)
    return lang
}

export function loadLanguageAsync(lang) {
    if (i18n.locale === lang)
        return Promise.resolve(setI18nLanguage(lang))

    if (loadedLanguages.includes(lang))
        return Promise.resolve(setI18nLanguage(lang))

    return import(`@lang/${lang}.js`).then(
        messages => {
            i18n.setLocaleMessage(lang, messages.default)
            loadedLanguages.push(lang)
            return setI18nLanguage(lang)
        }
    )
}