import type { Locale } from 'vue-i18n'
import { defineRule, configure } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n';
import rules from '@vee-validate/rules'
import { APP_LOCALE_DEFAULT, APP_LOCALE_LIST } from '/config/env'

const files = import.meta.glob('/lang/form-validation/*.json'),
    messages: Record<string, object> = {}

const // methods
    loadMessages = async () => {
        for (const path in files) {
            const module = await files[path](),
                msgs = module.default,
                locale: Locale = Object.keys(APP_LOCALE_LIST).find((locale: Locale) => path.includes(locale))
    
            if (!locale) continue
    
            messages[locale] = { ...messages[locale], ...{ messages: msgs['form-validation'] } }
        }
    },
    defineRules = () => Object.keys(rules).forEach(rule => defineRule(rule, rules[rule])),
    setup = async () => {
        defineRules()
        configure({ generateMessage: localize(messages) })
        setLocale(APP_LOCALE_DEFAULT)
    }

export { setup }
