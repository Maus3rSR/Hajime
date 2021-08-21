<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n, Locale } from 'vue-i18n'
/**
 * @todo locale list must be a parameter of the plugin
 */
import { SUPPORT_LOCALES, getIso31661Alpha2Code } from '/config/i18n.ts'

export default defineComponent({
    name: 'LangSwitcher',
    setup() {
        const { locale } = useI18n({ useScope: 'global' })
            , getClass = (l: Locale) => `flag-icon-${getIso31661Alpha2Code(l)}`
            , changeLocale = (l: Locale) => {
                if (l === locale) return
                locale.value = l
            }

        return { SUPPORT_LOCALES, getClass, changeLocale, locale }
    },
})
</script>

<template>
    <div class="dropdown dropdown-left">
        <div tabindex="0" class="btn btn-xs">
            <span class="flag-icon" :class="getClass(locale)" />
        </div>
        <ul
            tabindex="0"
            class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
        >
            <li
                v-for="(name, _locale) in SUPPORT_LOCALES"
                :key="_locale"
                :class="{ disabled: _locale === locale }"
            >
                <a @click="changeLocale(_locale)">
                    <span class="flag-icon" :class="getClass(_locale)" /> &nbsp;
                    {{ name }}
                </a>
            </li>
        </ul>
    </div>
</template>

<style>
@import 'flag-icon-css/css/flag-icon.min.css';
</style>