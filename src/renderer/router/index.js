import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
        {
            // Software contain the default layout
            path: '/',
            component: require('@components/layouts/software').default,
            meta: {
                breadcrumb: 'Accueil',
            },
            children: [
                {
                    name: 'dashboard',
                    path: '', // root of software
                    component: require('@components/software/Dashboard').default
                },
                {
                    name: 'create-competition',
                    path: 'competition/new',
                    component: require('@components/software/competition/Create').default,
                    meta: {
                        breadcrumb: 'Nouvelle compétition',
                        theme: 'competition'
                    }
                },
                {
                    name: 'manage-competition',
                    path: 'competition/:id',
                    props: true,
                    component: require('@components/software/competition/Manage').default,
                    meta: {
                        breadcrumb: 'Gestion d\'une compétition', // @todo Dynamique
                        theme: 'competition'
                    }
                }
            ]
        },
        {
            path: '/welcome',
            component: require('@components/Welcome').default
        },
        {
            path: '/error',
            component: require('@components/layouts/error').default,
            children: [
                { path: '404', component: require('@components/error/NotFound').default },
                { path: 'db', component: require('@components/error/DatabaseConnection').default },
            ]
        },
        { path: '*', redirect: '/error/404' },
    ]
})
