const component_list = {
    POOL: "Pool",
    TREE: "Tree"
}

const formula_list = [
    {
        id: 1,
        name: "Matchs de poule",
        component_list: [component_list.POOL]
    },
    {
        id: 2,
        name: "Arbre éliminatoire",
        component_list: [component_list.TREE]
    },
    {
        id: 3,
        name: "Matchs de poule & Arbre éliminatoire",
        component_list: [component_list.POOL, component_list.TREE]
    }
]

const state = {}

const getters = {
    list: () => formula_list
}

const mutations = {}
const actions = {}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}