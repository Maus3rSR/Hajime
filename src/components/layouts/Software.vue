<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Software',
})
</script>

<template>
    <div id="software" data-theme="luxury" class="block overflow-x-hidden bg-gradient-to-br from-primary to-secondary">
        <header>
            <nav class="navbar mb-2 bg-opacity-75">
                <div class="logo flex-1 px-2 mx-2">
                    <router-link to="/">
                        <img class="img img-responsive" src="/assets/img/logo.png" alt="logo" />
                    </router-link>
                </div>
            </nav>
        </header>
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
