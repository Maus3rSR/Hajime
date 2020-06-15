/**
 * TODO à rendre plus dynamique !
 */
const color_list = [{
    color: "red",
    label: "ROUGE"
},{
    color: "white",
    label: "BLANC"
}]

const state = {}

const getters = {
    color_list: () => color_list
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