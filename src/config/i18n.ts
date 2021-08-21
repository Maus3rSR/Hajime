import type { VueI18n, Locale } from 'vue-i18n'
import { createI18n } from 'vue-i18n'
import {
    APP_LOCALE_DEFAULT,
    APP_LOCALE_FALLBACK,
    APP_LOCALE_LIST,
} from '/config/env.ts'

/**
 * @todo find a way to load them when a locale is needed or at least lazy load all the files
 * @see https://vue-i18n.intlify.dev/guide/advanced/lazy.html
 */
const allMessages = import.meta.glob('/lang/**/*.json'),
    messages: { [key: string]: Object } = {}

await (async () => {
    for (const path in allMessages) {
        const module = await allMessages[path](),
            msgs = module.default,
            locale: Locale = Object.keys(APP_LOCALE_LIST).find(
                (locale: Locale) => path.includes(locale)
            )

        if (!locale) continue

        messages[locale] = { ...messages[locale], ...msgs }
    }
})()

const i18n: VueI18n = createI18n({
    legacy: false,
    locale: APP_LOCALE_DEFAULT,
    fallbackLocale: APP_LOCALE_FALLBACK,
    silentFallbackWarn: true,
    messages,
})

export const SUPPORT_LOCALES = APP_LOCALE_LIST
export const getIso31661Alpha2Code = (locale: Locale): string => {
    const localeSplitted = locale.split('_')
    return localeSplitted.length > 1
        ? localeSplitted[1].toLowerCase()
        : localeSplitted[0]
}
export default i18n
