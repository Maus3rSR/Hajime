<script>
import { loadLanguageAsync } from '@config/i18n.js'

export default {
    computed: {
        supported_locale_list() {
            return {
                "gb": "English",
                "fr": "Français",
            }
        },
        current_locale() {
            return this.$i18n.locale
        }
    },
    methods: {
        switchToLocale(locale) {
            loadLanguageAsync(locale)
            this.$configuration.set("app_lang", locale)
        }
    }
}
</script>

<template> 
    <b-dropdown class="lang-switcher" variant="light" toggle-class="text-decoration-none" no-caret>

        <template v-slot:button-content>
            <gb-flag :code="current_locale" size="huge" />
        </template>

        <b-dropdown-item v-for="(name, locale) in supported_locale_list" :key="locale" :disabled="locale === current_locale" @click.prevent="switchToLocale(locale)">
            <gb-flag :code="locale" size="small" /> {{ name }}
        </b-dropdown-item>
    </b-dropdown>
</template>

<style lang="scss">
.lang-switcher {
    button {
        transform: scale(.5);
    }
}
</style>

<style>

</style>