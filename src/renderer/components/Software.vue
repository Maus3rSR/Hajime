<script>
export default {
    
}
</script>

<template>
    <main class="main" data-sa-theme="1">

        <!-- Header -->
        <header class="header">
            <!-- <div class="navigation-trigger hidden-xl-up" data-sa-action="aside-open" data-sa-target=".sidebar">
                <i class="zmdi zmdi-menu"></i>
            </div> -->

            <div class="logo hidden-sm-down">
                <h1>
                    <a href="javascript:void(0);">ASKC</a>
                </h1>
            </div>

        </header>

        <!-- Sidebar -->
        <aside class="sidebar sidebar--hidden">
            <div class="scrollbar-inner">

            </div>
        </aside>

        <!-- Content -->
        <section class="content content--full">
            <router-view></router-view>
        </section>

        <!-- Footer -->
        <footer class="footer">
            Copyright © ASKC
        </footer>

    </main>
</template>

<style lang="scss">
    
</style>
