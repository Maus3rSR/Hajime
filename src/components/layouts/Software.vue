<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import * as LayoutComponents from '/components/partials/layout'

export default defineComponent({
    name: 'Software',
    components: { ...LayoutComponents },
    setup() {
        const { t } = useI18n()
        return { t }
    },
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
        <Header></Header>

        <main>
            <RouterView></RouterView>
        </main>

        <Footer></Footer>
    </div>
</template>

<style>
@import 'animate.css/animate.css';

#software {
    display: grid;
    grid-auto-columns: 1fr;
    grid-template-rows: min-content 1fr min-content;
    gap: 0px 0px;
}
</style>

<style scoped>
#software {
    height: 100vh;
}
</style>
