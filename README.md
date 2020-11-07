![logo]

![MIT License][badge-license]

**Special Sponsors**

[![lokalise_logo]][lokalise_link]

# Hajime

Hajime is an Electron application for managing Kendo competition

# Supporting Hajime

Hajime is an MIT-licensed open source projet with its development made possible entirely by the support of these backers. If you'd like to join them, please consider:

* [Become a backer or sponsor on Patreon][patreon-link]
* [One-time donation via PayPal][paypal-link]

# Project status

The project is currently slowed down due to lack of resources _(currently only the main author is working on **Hajime**)_:
- Developers that want to contribute to the project
- Donations that can help actively growing the project and finish the MVP that every Kendo's dojo can use it in a Kendo competition event

# Roadmap (MVP)

TODO: add details, explanations, images

* :white_check_mark: Competition creation workflow
  * :white_check_mark: General informations
  * :white_check_mark: Importing fighters or teams
  * :white_check_mark: Setup the competition formula _(rules)_
* Competition **'D-Day'** workflow
  * :white_check_mark: Fighters/Teams list review and lock
  * :white_check_mark: Pools _(Todo: more detail)_
  * :white_check_mark: Fight scoring
  * Tournament bracket in the same UX/UI than Pools _(Todo: more detail)_
* :white_check_mark: i18n _(:fr:, :gb: for the begining)_
* Marking board
* Live-scoring application
  * Slave application connected to a master application through [socket.io](https://socket.io/)
  * Must work without internet (local network)
  * Reflexion about making an mobile / tablet app (using Flutter, React Native, etc.) or keep using Electron as it can be installed on a windows tablet (can be enough)
  * It should share a part of the components as we already handle list of fights, fight scoring, etc...

## Scoring application

# Installation

## Dependancies

These dependancies are required to launch the project :

* [NodeJS](https://nodejs.org/en/)
* [Yarn](https://yarnpkg.com/lang/en/) (More reliable than `npm` to manage packages)

Then you need to install the project dependancies by launching `yarn`

## Scripts

Defined in  `package.json` :
- `yarn dev` : launch the application in development mode
- `compile` : Compile source code with webpack
- `build` : Create an executable installation on the current OS environment
- `build:fast` : Faster build only for test purposes in production mode
- `postinstall` : Compile binaries dependancies (eg. drivers like mysql, sqlite, etc.)

# Technical details of the project

## Main technologies and libraries

* [Electron](https://electronjs.org/)
* [Webpack](https://webpack.js.org/)
* [Electron-Webpack](https://webpack.electron.build/)
* [Vuejs](https://fr.vuejs.org/v2/guide/)
* [Vuex](https://vuex.vuejs.org/)
* [Vue-router](https://router.vuejs.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Bootstrap-Vue](https://bootstrap-vue.js.org/)
* [Bootstrap theme](http://byrushan.com/projects/super-admin/app/2.1/index.html)
* [Material icon](http://zavoloklom.github.io/material-design-iconic-font/)
* [Sass](https://sass-lang.com/documentation/syntax)
* [Sequelize](https://sequelize.org/v5/)

## Directory structure

* `/dist` : contain production files when `yarn build` was used
  * `/src/main` : [main process](https://electronjs.org/docs/tutorial/application-architecture) of Electron
  * `/src/renderer` : [render process](https://electronjs.org/docs/tutorial/application-architecture) of Electron
    * `/src/renderer/index.js` : Entry point
    * `/src/renderer/App.vue` : Vue JS entry point
    * `/src/renderer/assets` : Images, fonts, etc...
    * `/src/renderer/screens` : VueJS components which are screens of the app
    * `/src/renderer/database` : Contain all files related to the database. models definition, sequelize, migrations
    * `/src/renderer/plugins` : Custom Vue JS components loaded as a plugin
    * `/src/renderer/router` : Vue-router configuration files
    * `/src/renderer/store` : Vuex files
* `/database` : Mysql workbench files
* `/webpack/webpack.renderer.additions.js` : Webpack's override configuration
* `.env` : environment variables

## Contributing

You can contribute to **Hajime** by following [CONTRIBUTING.MD][contributing]

[//]: # (List of reference)
[logo]: .github/logo_black.png
[contributing]: .github/CONTRIBUTING.md
[badge-license]: https://img.shields.io/github/license/Maus3rSR/hajime?style=flat-square
[paypal-link]: https://www.paypal.com/paypalme/mausersr
[patreon-link]: https://www.patreon.com/hajime_software

[//]: # (Sponsors references)
[lokalise_logo]: https://lokalise.com/build/images/logo.6c425399.svg
[lokalise_link]: https://lokalise.com
