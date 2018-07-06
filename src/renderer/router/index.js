import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
        {
            // Software contain the default layout
            // We will be able to set a route (not children) like '/login' with a completely different layout in the future
            path: '/',
            component: require('@/components/Software').default,
            meta: {
                breadcrumb: 'Accueil',
            },
            children: [
                {
                    path: '/', // root of software
                    name: 'dashboard',
                    component: require('@/components/Software/Dashboard').default
                },
                {
                    path: '/competition/new',
                    name: 'create-competition',
                    component: require('@/components/Software/Competition/Create').default,
                    meta: {
                        breadcrumb: 'Nouvelle compétition',
                    }
                }
            ]
        }
    ]
})
