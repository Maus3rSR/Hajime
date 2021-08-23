<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n, Locale } from 'vue-i18n'
import { SUPPORT_LOCALES, getIso31661Alpha2Code } from '/config/i18n.ts'

export default defineComponent({
    name: 'LangSwitcher',
    setup() {
        const { locale } = useI18n({ useScope: 'global' }),
            changeLocale = (l: Locale) => {
                if (l === locale) return
                locale.value = l
            }

        return {
            SUPPORT_LOCALES,
            getIso31661Alpha2Code,
            changeLocale,
            locale,
        }
    },
})
</script>

<template>
    <div class="dropdown dropdown-left">
        <button
            tabindex="0"
            aria-haspopup="listbox"
            class="btn btn-xs btn-square btn-flag"
        >
            <LangSwitcherFlag :iso="getIso31661Alpha2Code(locale)" />
        </button>
        <ul
            role="listbox"
            tabindex="0"
            class="
                p-2
                shadow
                menu
                dropdown-content
                bg-base-100
                rounded-box
                w-52
            "
        >
            <li
                role="option"
                v-for="(name, _locale) in SUPPORT_LOCALES"
                :key="_locale"
                :class="{ disabled: _locale === locale }"
            >
                <a
                    href="javascript:void(0)"
                    @click.prevent="changeLocale(_locale)"
                >
                    <LangSwitcherFlag :iso="getIso31661Alpha2Code(_locale)" />
                    &nbsp;
                    {{ name }}
                </a>
            </li>
        </ul>
    </div>
</template>

<style>
.btn-flag {
    position: relative;
    overflow: hidden;
    border: none;
}

.btn-flag .flag-icon {
    position: absolute;
    width: 2.6em;
    line-height: 3em;
}
</style>

<style scoped>
.dropdown:focus {
    background-color: red;
}
</style>