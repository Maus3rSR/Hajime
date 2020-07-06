<script>
export default {
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/error/notFound.json"></i18n>

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
