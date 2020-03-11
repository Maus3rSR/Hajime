# Installation du projet

## Dépendances système

Installer ces dépendances système permettant de développer sur le projet

* [NodeJS](https://nodejs.org/en/) : Permet d'exécuter javascript hors d'un navigateur
* [Yarn](https://yarnpkg.com/lang/en/) : Gestionnaire de modules de nodeJS (plus fiable que `npm`)

## GIT

Faire un git clone ou git pull sur votre ordinateur

## Installation des paquets

Lancer la commande `yarn`

# Détails techniques du projet

## Technologies et librairies utilisées

* [Electron](https://electronjs.org/) : basé sur NodeJS et Chromium, permet de créer des applications hybride multi OS
* [Webpack](https://webpack.js.org/) : Permet de compiler les ressources de tout types et endroits (`.js, .vue, .css, .sass, .png, .jpg`, etc...) en quelques fichiers statiques
* [Electron-Webpack](https://webpack.electron.build/) : Permet de s'affranchir des difficultés que nécéssite la configuration webpack adaptée à Electron et permet de facilement étendre sa configuration au besoin
* [Vuejs](https://fr.vuejs.org/v2/guide/) : Permet de créer des interfaces utilisateurs réactives
* [Vuex](https://vuex.vuejs.org/) : Gestionnaire d'état de données de Vuejs
* [Vue-router](https://router.vuejs.org/) : Système de routes de vue pour les applications mono-page
* [Bootstrap](https://getbootstrap.com/) : Framework CSS
* [Bootstrap-Vue](https://bootstrap-vue.js.org/) : Permet de facilement utiliser les composants dynamiques bootstrap avec Vue (modal, tooltip, popover, etc... et d'éviter d'utiliser d'autres fichiers javascript de bootstrap qui utilisent des dépendances que nous ne voulons pas)
* [Thème super-admin](http://byrushan.com/projects/super-admin/app/2.1/index.html) : Un joli thème fait sur Bootstrap
* [Material icon](http://zavoloklom.github.io/material-design-iconic-font/) : Librairie d'icônes utilisé par le thème
* [Sass](https://sass-lang.com/documentation/syntax) : Permet d'écrire du CSS dynamique, avec variables, etc... et avec une syntaxe plus robuste et flexible
* [Sequelize](https://sequelize.org/v5/) : [ORM](https://www.base-de-donnees.com/orm/) basé sur NodeJS pour communiquer avec une base de données

## Arborescence du projet

* `.git` : contient les fichiers git locaux
* `/dist` : contient les fichiers lorsque l'on fait un build pour créer un éxécutable de production
* `/node_modules` : contient toutes dépendances du projet définis dans le package.json. Chaque module peut également avoir des sous-dépendances, ils sont tous placés dans ce dossier
* `/src` : contient les fichiers sources du projet
  * `/src/main` : [processus principal](https://electronjs.org/docs/tutorial/application-architecture). Contient le code qui permet de créer le GUI Electron
  * `/src/renderer` : [processus de rendu](https://electronjs.org/docs/tutorial/application-architecture). Contient le code source contenu dans le GUI principal d'Electron. 90% du code sera situé à ce niveau
    * `/src/renderer/index.js` : Point d'entrée de l'application
    * `/src/renderer/App.vue` : Point d'entrée de l'application vue. Nous faisons donc ici une [SPA](https://fr.wikipedia.org/wiki/Application_web_monopage) (Application mono-page)
    * `/src/renderer/assets` : Contient différentes ressources (images, css, fonts, etc...)
    * `/src/renderer/components` : Composants VueJS organisés selon une arborescence arbitraire
    * `/src/renderer/database` : Contient les éléments permettant de se connecter à une base de données via `Sequelize` et également de faire un système de migration, si souhaité
    * `/src/renderer/plugins` : Plugins VueJS permettant de les utiliser dans n'importe quel composant Vue
    * `/src/renderer/router` : Contient le fichier de configuration de Vue-router
    * `/src/renderer/store` : Contient les éléments pour Vuex
* `/webpack/webpack.renderer.additions.js` : contient une configuration étendue à webpack
* `.env` : permet de définir des variables d'environnement
* `package.json` : descripteur du projet pour nodejs et parfois utilisé par les dépendances basées sur nodejs

## Scripts

En ligne de commande, vous serez en mesure de lancer plusieurs scripts "raccourcis" définis dans `package.json` :
- `dev` : Permet de lancer Electron en mode développement. Vous bénéficiez également un système de mise à jour automatique pendant que vous écrivez du code, ce code modifié sera directement injecté et vous aurez pas besoin de lancer ce script à chaque fois. Merci Electron-webpack ;-)
- `compile` : Permet de compiler un paquet du code source
- `build` : Créer un exécutable installable sur le système courant
- `build:fast` : Pareil que build mais plus rapide à des fins de test en mode production
- `postinstall` : Compile les dépendances binaires (par exemple les drivers mysql, sqlite, etc...)

Il suffira de lancer la commande `yarn dev` par exemple, pour lancer l'application.