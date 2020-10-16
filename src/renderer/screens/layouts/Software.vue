<script>
import log from 'electron-log'
import { DateTime } from 'luxon'

import i18n from '@config/i18n'
import commonTranslations from '@lang/generic/common.json'
import translations from '@lang/mail/support.json'

i18n.mergeLocaleMessage("gb", commonTranslations.gb)
i18n.mergeLocaleMessage("fr", commonTranslations.fr)
i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

export default {
    beforeRouteUpdate(to, from, next) {
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = 'fade'

        if (toDepth !== fromDepth) {
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
        
        this.checkDisplay(to)
        this.setTheme(to)

        next()
    },
    computed: {
        current_year() {
            return DateTime.local().toFormat('yyyy')
        },
        log_path() {
            return log.transports.file.findLogPath()
        },
        os() {
            return `${this.$os.platform} ${this.$os.release} ${this.$os.arch}`
        },
        mail_to() {
            return process.env.ELECTRON_WEBPACK_ISSUE_EMAIL
        },
        mail_subject() {
            return `[FEEDBACK] On page ${this.$route.name}`
        },
        mail_body() {
            return i18n.t('mail.support', { log_path: this.log_path, os: this.os, app_version: this.$app.version }).replace(/\n/g, "%0D")
        }
    },
    methods: {
        checkDisplay(route) {
            this.displayHeader = (undefined === route.meta.displayHeader) ? this.displayHeader : route.meta.displayHeader
            this.displayFooter = (undefined === route.meta.displayFooter) ? this.displayFooter : route.meta.displayFooter
        },
        setTheme(route) {
            this.theme = (undefined === route.meta.theme) ? '' : route.meta.theme
        },
        installUpdates() {
            this.$ipc.send('install-update')
        },
        openMailClientForFeedback() {
            this.$shell.openExternal(`mailto:${this.mail_to}?subject=${this.mail_subject}&body=${this.mail_body}`)
        },
        openAuthorPage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_AUTHOR_PAGE)
        },
        openGithubPage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_GITHUB_PAGE)
        },
        openPaypalPage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_PAYPAL_PAGE)
        },
        openPatreonPage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_PATREON_PAGE)
        },
        openLicensePage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_LICENSE_PAGE)
        },
        askDownloadUpdate() {
            this.$notify.show(this.$t("common.update.available"), {
                ...this.$notify.getOption("info"),
                action: [{
                    text: this.$t("common.yes"),
                    onClick: (e, toastObject) => this.$ipc.send('download-update')
                }, {
                    text: this.$t("common.later"),
                    onClick: (e, toastObject) => toastObject.goAway(0)
                }],
            })
        },
        askInstallUpdate() {
            this.$notify.show(this.$t("common.update.install"), {
                ...this.$notify.getOption("info"),
                action: [{
                    text: this.$t("common.yes"),
                    onClick: (e, toastObject) => this.$ipc.send('install-update')
                }, {
                    text: this.$t("common.later"),
                    onClick: (e, toastObject) => toastObject.goAway(0)
                }],
            })
        }
    },
    data() {
        return {
            displayHeader: true,
            displayFooter: true,
            transitionName: 'fade',
            theme: '',
        }
    },
    mounted() {
        this.checkDisplay(this.$route)
        this.setTheme(this.$route)

        this.$ipc.on('update-available', () => this.askDownloadUpdate())
        this.$ipc.on('update-downloaded', () => this.askInstallUpdate())
    }
}
</script>

<template>
    <main id="software" class="main" data-sa-theme="1" :data-sa-theme-extended="theme">

        <!-- Header -->
        <header class="header" v-if="displayHeader">
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

            <breadcrumb />

            <div class="top-nav">
                <lang-switcher />
            </div>

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
        <footer id="software__footer" class="footer" v-if="displayFooter">
            <div class="row">
                <div class="col-sm-7">
                    <button title="Voir la note de version" class="btn btn-sm btn-dark btn--icon-text">
                        {{ $app.version }}
                    </button>
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openMailClientForFeedback">
                        <i class="zmdi zmdi-bug"></i>
                        Bug / Suggestion
                    </button>
                    <button href="javascript:void(0)" @click.prevent="openLicensePage" class="btn btn-sm btn-dark btn--icon-text">
                        MIT License
                    </button>
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openGithubPage">
                        <i class="zmdi zmdi-github"></i>
                        Github
                    </button>
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openPaypalPage">
                        <i class="zmdi zmdi-paypal-alt"></i>
                        Paypal
                    </button>
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openPatreonPage">
                        Patreon
                    </button>
                </div>
                <div class="col-sm-5 text-right">
                    2020 - Made with <span class="text-red">&#10084;</span>
                    <a id="k_logo" href="javascript:void(0)" @click.prevent="openAuthorPage">
                        <img src="@images/k.png" alt="Kevin UNFRICHT">
                    </a>
                </div>
            </div>
        </footer>

        <!-- <slideout-panel></slideout-panel> -->
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

    #k_logo {
        margin-right: 14px;

        img {
            position: absolute;
            width: 14px;
            height: auto;
            top: -10px;
            right: 10px;
            z-index: 0;
        }
    }
}
</style>
