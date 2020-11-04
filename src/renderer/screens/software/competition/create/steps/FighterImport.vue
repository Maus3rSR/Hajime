<script>
import { mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { createVueI18nInstance } from '@config/i18n'
import createTranslations from '@lang/screens/software/competition/create/messages'

import EntryList from '@partials/list/entry_list/Component'

export default {
    i18n: createVueI18nInstance(createTranslations),
    components: { EntryList },
    computed: {
        ...mapState('competition', {
            competition_type: state => state.model.type,
        }),
        ...mapFields('competition', {
            entry_list: 'model.entry_list'
        }),
        step_is_valid() {
            return this.entry_list.length > 0
        },
    },
    methods: {}
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <entry-list v-model="entry_list" :competition_type="competition_type" />
            </div>
        </div>

        <div class="row software__container--offset-element">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success tada': step_is_valid}" class="btn float-right animated" @click="$emit('onValidate')">
                    {{ $t("common.action.step-next") }}
                    <i class="zmdi zmdi-arrow-right"></i>
                </button>
                
                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    {{ $t("common.action.step-previous") }}
                </button>
            </div>
        </div>
    </div>
</template>
