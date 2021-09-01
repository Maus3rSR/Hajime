<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Header',
    setup() {},
})
</script>

<template>
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
            <BreadcrumbRouter class="flex-1 px-2 mx-2"></BreadcrumbRouter>
            <!-- LANG SWITCHER -->
            <div>
                <LangSwitcher class="flex-2"></LangSwitcher>
            </div>
        </nav>
    </header>
</template>

<style scoped>
.navbar {
    min-height: 0;
}

.logo img {
    width: 80px;
}
</style>
