import { createI18n } from 'vue-i18n'
import { APP_LOCALE_DEFAULT, APP_LOCALE_FALLBACK, APP_LOCALE_LIST } from '/config/env.ts'
import commonMessages from '/lang/generic/common/messages.ts'

const i18n = createI18n({
    legacy: false,
    locale: APP_LOCALE_DEFAULT,
    fallbackLocale: APP_LOCALE_FALLBACK,
    silentFallbackWarn: true,
    messages: commonMessages
})

export default i18n