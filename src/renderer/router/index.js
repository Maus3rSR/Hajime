import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
        {
            // Software contain the default layout
            // We will be able to set a route (not children) like '/login' with a completely different layout in the future
            path: '/',
            component: require('@components/layouts/Software').default,
            meta: {
                breadcrumb: 'Accueil',
            },
            children: [
                {
                    name: 'dashboard',
                    path: '/', // root of software
                    component: require('@components/Software/Dashboard').default
                },
                {
                    name: 'create-competition',
                    path: '/competition/new',
                    component: require('@components/Software/Competition/Create').default,
                    meta: {
                        breadcrumb: 'Nouvelle compétition',
                        theme: 'competition'
                    }
                },
                {
                    name: 'manage-competition',
                    path: '/competition/:id',
                    props: true,
                    component: require('@components/Software/Competition/Manage').default,
                    meta: {
                        breadcrumb: 'Gestion d\'une compétition', // @todo Dynamique
                        theme: 'competition'
                    }
                }
            ]
        },
        { path: '/dberror', component: require('@components/layouts/DatabaseConnection').default },
        { path: '/dbnotfound', component: require('@components/layouts/DatabaseConnection').default, props: { empty_config: true } },
        { path: '/404', component: require('@components/layouts/NotFound').default },
        { path: '*', redirect: '/404' },
    ]
})
