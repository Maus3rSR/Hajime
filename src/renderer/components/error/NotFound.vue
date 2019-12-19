<script>
export default {
}
</script>

<template>
    <section id="error__404">
        <h1>Oops... :-(</h1>
        <h2>La page que vous recherchez n'existe pas !</h2>
        <p>
            <button title="Aller sur la page d'accueil" class="btn btn-primary" @click.prevent="$router.push('/')">
                <i class="zmdi zmdi-arrow-home"></i> Aller sur la page d'accueil
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
