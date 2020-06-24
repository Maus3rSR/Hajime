<script>
import log from 'electron-log'
import { DateTime } from 'luxon'

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
            return `Ceci est un mail qui sera envoyé au support de ce logiciel.
Si votre demande concerne une suggestion/amélioration, vous pouvez ignorez tout le contenu de ce mail, l'effacer et faire votre demande.

Veuillez vérifier avant de confirmer l'envoi que :
    1. Vous êtes certain que le problème vous empêche d'utiliser convenablement le logiciel et que cela n'est pas dû à une mauvaise compréhension de son utilisation
    2. Vous avez bien complété le sujet pré-remplis avec un résumé clair du problème
    3. Vous avez bien remplis chaque étape demandée ci-dessous
    4. Vous avez bien mis en pièces-jointe des captures d'écran permettant de rapidement identifier le problème
    5. Vous avez bien mis en pièces-jointe le journal de santé du logiciel situé à cet emplacement :
            
            ${this.log_path}

### SYSTEME D'EXPLOITATION ET VERSION DU LOGICIEL :

OS \`${this.os}\`
Logiciel version \`${this.$app.version}\`

### COMPORTEMENT ATTENDU

Complétez le contenu

### COMPORTEMENT ACTUEL

Complétez le contenu

### ETAPES POUR REPRODUIRE LE SOUCIS

Complétez le contenu

### REMARQUES COMPLEMENTAIRES

Complétez le contenu si nécéssaire

### Indiquez votre adresse email juste après si vous souhaitez un suivi de ce ticket

Indiquez votre adresse email si souhaité
`
            .replace(/\n/g, "%0D")
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
        openLicensePage() {
            this.$shell.openExternal(process.env.ELECTRON_WEBPACK_LICENSE_PAGE)
        },
    },
    data() {
        return {
            displayHeader: true,
            displayFooter: true,
            transitionName: 'fade',
            theme: '',
            showUpdateButton: false
        }
    },
    mounted() {
        this.checkDisplay(this.$route)
        this.setTheme(this.$route)
        this.$ipc.on('update-downloaded', () => this.showUpdateButton = true)
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

            <breadcrumbs></breadcrumbs>

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
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openGithubPage">
                        <i class="zmdi zmdi-github"></i>
                        Github
                    </button>
                    <button href="javascript:void(0)" @click.prevent="openLicensePage" class="btn btn-sm btn-dark btn--icon-text">
                        MIT License
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
