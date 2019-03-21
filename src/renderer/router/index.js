import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
        {
            // Software contain the default layout
            // We will be able to set a route (not children) like '/login' with a completely different layout in the future
            path: '/',
            component: require('@/components/layouts/Software').default,
            meta: {
                breadcrumb: 'Accueil',
            },
            children: [
                {
                    name: 'dashboard',
                    path: '/', // root of software
                    component: require('@/components/software/Dashboard').default
                },
                {
                    name: 'create-competition',
                    path: '/competition/new',
                    component: require('@/components/software/competition/Create').default,
                    meta: {
                        breadcrumb: 'Nouvelle compétition',
                    }
                },
                {
                    name: 'manage-competition',
                    path: '/competition/:id',
                    props: true,
                    component: require('@/components/software/competition/Manage').default,
                    meta: {
                        breadcrumb: 'Gestion d\'une compétition' // @todo Dynamique
                    }
                }
            ]
        },
        { path: '/404', component: require('@/components/layouts/NotFound').default },  
        { path: '*', redirect: '/404' },
    ]
})
