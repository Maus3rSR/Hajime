const type_list = {
    INDI: "INDI",
    TEAM: "TEAM"
}

const state = {
    list: [
        {
            txt: "Individuelle",
            value: type_list.INDI
        },
        {
            txt: "Equipe",
            value: type_list.TEAM
        },
    ]
}

const getters = {
    all: state => state.list,
    default: () => type_list.INDI
}

const mutations = {

}

const actions = {

}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}