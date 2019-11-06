<script>
export default {
    beforeRouteUpdate(to, from, next) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = 'fade'

        if (toDepth !== fromDepth) {
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
        
        this.setTheme(to)

        next()
    },
    methods: {
        setTheme(route) {
            this.theme = (undefined === route.meta.theme) ? '' : route.meta.theme
        }
    },
    data() {
        return {
            transitionName: 'fade',
            theme: ''
        }
    },
    mounted() {
        this.setTheme(this.$route)
    }
}
</script>

<template>
    <main id="software" class="main" data-sa-theme="1" :data-sa-theme-extended="theme">

        <!-- Header -->
        <header class="header">
            <!-- <div class="navigation-trigger hidden-xl-up" data-sa-action="aside-open" data-sa-target=".sidebar">
                <i class="zmdi zmdi-menu"></i>
            </div> -->

            <div class="logo hidden-sm-down">
                <h1>
                    <router-link to="/">
                        {{ $app.name || uppercase }}
                    </router-link>
                </h1>
            </div>

            <breadcrumbs></breadcrumbs>

        </header>

        <!-- Sidebar -->
        <aside class="sidebar sidebar--hidden">
            <div class="scrollbar-inner">

            </div>
        </aside>

        <!-- Content -->
        <div class="content content--full">
            <transition :name="transitionName" mode="out-in" appear>
                <router-view></router-view>
            </transition>
        </div>

        <!-- Footer -->
        <footer id="software__footer" class="footer">
            <div>
                Version {{ $app.version }}
            </div>
            <div>
                © Copyright All rights reserved - Kevin UNFRICHT
            </div>
        </footer>

    </main>
</template>

<style lang="scss">
#software {
    .content {
        &>* {
            // Pour la transition slide left/right
            transition: all .5s cubic-bezier(.55,0,.1,1);
        }
    }
}
</style>
