<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
    name: 'Software',
    setup() {
        const { t } = useI18n()
        return { t }
    }
})
</script>

<template>
    <div
        id="software"
        class="
            block
            overflow-x-hidden
            bg-gradient-to-br
            from-primary
            to-secondary
        "
    >
        <header>
            <nav class="navbar mb-2 bg-opacity-75">
                <!-- LOGO -->
                <div class="logo flex-2 px-2 mx-2">
                    <RouterLink to="/">
                        <img
                            class="img img-responsive"
                            src="/assets/img/logo.png"
                            alt="logo"
                        />
                    </RouterLink>
                </div>
                <!-- BREADCRUMB -->
                <BreadcrumbRouter class="flex-1 px-2 mx-2" />
                <!-- LANG SWITCHER -->
                <div>
                    <LangSwitcher class="flex-2" />
                </div>
            </nav>
        </header>

        {{ t('common.name') }}.....
        <!-- {{ t('competition.action.close') }} -->
        <RouterView />
    </div>
</template>

<style>
@import 'animate.css/animate.css';
</style>

<style scoped>
#software {
    height: 100vh;
}

.navbar {
    min-height: 0;
}

.logo img {
    width: 80px;
}
</style>
