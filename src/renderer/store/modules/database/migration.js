import { CreateUmzugInstance } from '@root/database/umzug'
import i18n from '@config/i18n'
import commonTranslations from '@lang/generic/common.json'
import translations from '@lang/store/modules/database/migration.json'

i18n.mergeLocaleMessage("gb", commonTranslations.gb)
i18n.mergeLocaleMessage("fr", commonTranslations.fr)
i18n.mergeLocaleMessage("gb", translations.gb)
i18n.mergeLocaleMessage("fr", translations.fr)

let umzug_instance = null // We must not set it in the state because the object make internal updates when used and we can't handle these changes
let umzug_status = null

const defaultState = () => ({
    initialized: false,
    migrating: false,
    done: false,
    error: false
})

const state = defaultState()

const getters = {
    on: () => (callback_name, callback) => null === umzug_instance ? null : umzug_instance.on(callback_name, callback),
    pending: () => () => null === umzug_status ? 0 : umzug_status.pending.length,
    executed: () => () => null === umzug_status ? 0 : umzug_status.executed.length,
}

const mutations = {
    RESET(state) {
        state = defaultState()
        umzug_instance = null
    },
    MIGRATING(state) {
        state.migrating = true
    },
    DONE(state) {
        state.migrating = false
        state.done = true
    },
    ERROR(state) {
        state.migrating = false
        state.error = true
    },
    SET_INSTANCE(state, instance) {
        umzug_instance = instance
    },
    SET_STATUS(state, status) {
        umzug_status = status
        state.initialized = true
    }
}

const actions = {
    INIT({ commit }, sequelize_instance) {
        const { umzug, status } = CreateUmzugInstance(sequelize_instance)

        commit("SET_INSTANCE", umzug)

        status()
            .then(res => commit("SET_STATUS", res))
            .catch(() => {
                commit("ERROR")
                this.$notify.error(i18n.t("migration.error.data"))
            })
    },
    MIGRATE({ commit }, migration_option) {
        migration_option = migration_option || {}

        commit("MIGRATING")
        const promise = umzug_instance.up(migration_option)

        promise
            .then(() => commit("DONE"))
            .catch(() => {
                commit("ERROR")
                this.$notify.error(i18n.t("migration.error.data"))
            })
    
        return promise
    },
    IGNORE_MIGRATION({ dispatch, getters }) {
        if (getters.pending === 0)
            return Promise.resolve()

        return dispatch("MIGRATE", { from: umzug_status.pending[getters.pending - 1].file })
    }
}

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state,
    getters,
    mutations,
    actions
}