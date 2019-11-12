<script>
import log from 'electron-log'

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
    computed: {
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
            this.$shell.openExternal('https://www.linkedin.com/in/kevinunfricht/') // @TODO env
        }
    },
    data() {
        return {
            transitionName: 'fade',
            theme: '',
            showUpdateButton: false
        }
    },
    mounted() {
        this.setTheme(this.$route)
        this.$ipc.on('update-downloaded', () => this.showUpdateButton = true)
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
            <div class="row">
                <div class="col-sm-3">
                    <button title="Voir la note de version" class="btn btn-sm btn-dark btn--icon-text">
                        {{ $app.version }}
                    </button>
                </div>
                <div class="col-sm-6 text-center">
                    <button class="btn btn-sm btn-dark btn--icon-text" @click="openMailClientForFeedback">
                        <i class="zmdi zmdi-bug"></i>
                        Bug / Suggestion
                    </button>
                    
                    <transition name="fade" mode="out-in">
                        <button v-if="showUpdateButton" class="btn btn-sm btn-dark btn--icon-text" @click="installUpdates">
                            <i class="zmdi zmdi-refresh"></i>
                            Nouvelle version / Redémarrer pour installer
                        </button>
                    </transition>
                </div>
                <div class="col-sm-3 text-right">
                    © 2019 - Made with <span class="text-red" style="-webkit-text-stroke: 1px white;">&#10084;</span> <a href="javascript:void(0)" @click.prevent="openAuthorPage">Kevin UNFRICHT</a>
                </div>
            </div>
        </footer>

        <slideout-panel></slideout-panel>
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
