<script>
import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/error/notFound/messages'

export default {
    i18n: setupVueI18nMessages(translations),
}
</script>

<template>
    <section id="error__404">
        <h1>{{ $t("common.oops") }}... :-(</h1>
        <h2>{{ $t("error-screen.not-found") }}</h2>
        <p>
            <button class="btn btn-primary" @click.prevent="$router.push('/')">
                <i class="zmdi zmdi-arrow-home"></i> {{ $t("common.action.back-main") }}
            </button>
        </p>
    </section>
</template>

<style lang="scss">
#software {
    .content {
        &>div {
            // Pour la transition slide left/right
            transition: all .5s cubic-bezier(.55,0,.1,1);
        }
    }
}
</style>
