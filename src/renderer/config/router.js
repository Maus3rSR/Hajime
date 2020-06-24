import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
        {
            // Software contain the default layout
            path: '/',
            component: require('@screens/layouts/Software').default,
            meta: {
                breadcrumb: 'Accueil',
            },
            children: [
                {
                    name: 'dashboard',
                    path: '', // root of software
                    component: require('@screens/software/Dashboard').default
                },
                {
                    name: 'create-competition',
                    path: 'competition/new',
                    component: require('@screens/software/competition/Create').default,
                    meta: {
                        breadcrumb: 'Nouvelle compétition',
                        theme: 'competition'
                    }
                },
                {
                    name: 'manage-competition',
                    path: 'competition/:id',
                    props: true,
                    component: require('@screens/software/competition/Manage').default,
                    meta: {
                        breadcrumb: 'Gestion d\'une compétition', // @todo Dynamique
                        theme: 'competition'
                    }
                }
            ]
        },
        {
            path: '/fight/:fight_id/fighter1/:fighter1_id/fighter2/:fighter2_id',
            props: true,
            component: require('@screens/board/Fight').default
        },
        {
            path: '/welcome',
            component: require('@screens/Welcome').default
        },
        {
            path: '/app/update',
            component: require('@screens/app/Update').default
        },
        {
            path: '/error',
            component: require('@screens/layouts/Error').default,
            children: [
                { path: '404', component: require('@screens/error/NotFound').default },
                { path: 'db', component: require('@screens/error/DatabaseConnection').default },
            ]
        },
        { path: '*', redirect: '/error/404' },
    ]
})
