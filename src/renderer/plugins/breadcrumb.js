import VueBreadcrumbs from 'vue-breadcrumbs'

function install (Vue, options) {

    const template = `
    <nav aria-label="breadcrumb" role="navigation" v-if="$breadcrumbs.length">
        <ol class="breadcrumb">
            <li v-for="(crumb, index) in $breadcrumbs" class="breadcrumb-item" :class="{active: index === $breadcrumbs.length - 1}" aria-current="page">
                <template v-if="index < $breadcrumbs.length - 1">
                    <router-link v-if="index === 0" to="/">{{ crumb | crumbText }}</router-link>
                    <router-link v-else :to="linkProp(crumb)">{{ crumb | crumbText }}</router-link>
                </template>
                <template v-else>
                    {{ crumb | crumbText }}
                </template>
            </li>
        </ol>
    </nav>
    `

    Vue.use(VueBreadcrumbs, { template: template })
}

export default { install }