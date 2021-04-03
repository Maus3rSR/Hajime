<script>
import { ISO_LOCALE_LIST, setLanguage } from '@config/i18n.js'

export default {
    computed: {
        supported_locale_list() {
            return ISO_LOCALE_LIST
        },
        current_locale() {
            return this.$i18n.locale
        }
    },
    methods: {
        switchToLocale(locale) {
            setLanguage(locale)
            this.$configuration.set("app_lang", locale)
        },
        getClass(iso) {
            const isoParts = iso.split("_")
            const flagLocale = isoParts.length > 1 ? isoParts[1].toLowerCase() : isoParts[0]
            return `flag-icon-${flagLocale}`
        }
    }
}
</script>

<template> 
    <b-dropdown class="lang-switcher" variant="light" toggle-class="text-decoration-none" no-caret>

        <template v-slot:button-content>
            <span class="flag-icon" :class="getClass(current_locale)" />
        </template>

        <b-dropdown-item v-for="(name, locale) in supported_locale_list" :key="locale" :disabled="locale === current_locale" @click.prevent="switchToLocale(locale)">
            <span class="flag-icon" :class="getClass(locale)" />
            {{ name }}
        </b-dropdown-item>
    </b-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-toggle {
    .flag-icon {
        height: 3em;
        width: 3em;
    }
}
</style>

<style lang="scss">
.lang-switcher {
    button {
        transform: scale(.5);
    }
}
</style>