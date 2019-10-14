<script>
export default {
}
</script>

<template>
    <main id="error" class="main" data-sa-theme="1">
        <section class="error">
            <div class="error__inner">
                <router-view></router-view>
            </div>
        </section>
    </main>
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
