<script>
export default {
    beforeRouteUpdate (to, from, next) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = 'fade';
        if (toDepth !== fromDepth) {
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
        next()
    },
    data() {
        return {
            transitionName: 'fade'
        }
    }
}
</script>

<template>
    <main id="software" class="main" data-sa-theme="1">

        <!-- Header -->
        <header class="header">
            <!-- <div class="navigation-trigger hidden-xl-up" data-sa-action="aside-open" data-sa-target=".sidebar">
                <i class="zmdi zmdi-menu"></i>
            </div> -->

            <div class="logo hidden-sm-down">
                <h1>
                    <router-link to="/">
                        ASKC
                    </router-link>
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
            <div class="container">
                <breadcrumbs></breadcrumbs>

                <transition :name="transitionName" mode="out-in" appear>
                    <router-view></router-view>
                </transition>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            Copyright © ASKC
        </footer>

    </main>
</template>

<style lang="scss">
#software {
    .content {
        .container {
            &>div {
                // Pour la transition slide left/right
                transition: all .5s cubic-bezier(.55,0,.1,1);
            }
        }
    }
}
</style>
