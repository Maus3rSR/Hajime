<script setup lang="ts">
import { useI18n, Locale } from 'vue-i18n'
import { setLocale } from '@vee-validate/i18n';
import { SUPPORTED_LOCALES, getIso31661Alpha2Code } from '/config/i18n'

const // composables
    { locale } = useI18n({ useScope: 'global' }),
    // methods
    changeLocale = (l: Locale) => {
        if (l === locale) return
        locale.value = l
        setLocale(l)
    }
</script>

<template>
    <div class="dropdown dropdown-left">
        <button
            tabindex="0"
            aria-haspopup="listbox"
            class="btn btn-xs btn-square btn-flag"
        >
            <LangSwitcherFlag
                :iso="getIso31661Alpha2Code(locale)"
            ></LangSwitcherFlag>
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
                v-for="(name, _locale) in SUPPORTED_LOCALES"
                :key="_locale"
                :class="{ disabled: _locale === locale }"
            >
                <a
                    href="javascript:void(0)"
                    @click.prevent="changeLocale(_locale)"
                >
                    <LangSwitcherFlag
                        :iso="getIso31661Alpha2Code(_locale)"
                    ></LangSwitcherFlag>
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