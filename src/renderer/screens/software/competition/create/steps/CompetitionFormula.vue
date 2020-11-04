<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { createVueI18nInstance } from '@config/i18n'
import createTranslations from '@lang/screens/software/competition/create/messages'

import * as FormulaSettingsFormList from './competition_formula'
import CompetitionFormulaOption from '@partials/competition_formula/Option'

export default {
    i18n: createVueI18nInstance(createTranslations),
    components: { ...FormulaSettingsFormList, CompetitionFormulaOption },
    computed: {
        ...mapState('formula', {
            formula_list_loading: state => state.loading,
            formula_list: state => state.list
        }),
        ...mapGetters({
            competition_saving: "competition/saving",
            formula_count: "formula/count",
            getFormula: "formula/getFormula"
        }),
        ...mapFields('competition', ['model.choosen_formula_id', 'model.formula_config_list']),
        can_create_competition() {
            return this.formula_count > 0 && !this.competition_saving && this.formula_config_list.length > 0
        }
    },
    methods: {
        ...mapActions({
            loadFormulaList: "formula/LOAD_ALL",
            saveFormulaConfig: "competition/SAVE_FORMULA_CONFIG",
            createCompetition: "competition/CREATE"
        }),
        save() {
            if (this.competition_saving) return
            this.createCompetition().then(() => this.$emit('onValidate'))
        },
        onFormulaConfigUpdate(config) {
            this.canReset = false
            this.saveFormulaConfig(config)
                .then(() => this.canReset = true)
        }
    },
    watch: {
        choosen_formula_id: {
            handler: function () {
                if (this.canReset)
                    this.formula_config_list = []
            }
        },
        formula_list: {
            handler: function (new_list) {
                if (null === this.choosen_formula_id && new_list.length)
                    this.choosen_formula_id = this.formula_list[0].id
            },
            immediate: true
        }
    },
    created() {
        if (this.formula_list.length === 0)
            this.loadFormulaList()
    },
    data() {
        return {
            canReset: true // Prevent an issue when watching choosen_formula_id is triggered after this.saveFormulaConfig() and reset this.formula_config_list
        }
    }
}
</script>

<template>
    <div>
        <div class="form-group row">
            <label class="col-md-12 col-lg-3 col-form-label card-body__title" for="competition_formula">{{ $t("competition-create.action.choose-formula") }}</label>
            <div class="col-md-12 col-lg-9">
                <div v-if="formula_count == 0 && !formula_list_loading" class="h4 alert alert-warning">
                    <i class="zmdi zmdi-alert-triangle"></i>
                    {{ $t("competition-create.formula.empty") }} :-(
                </div>
                <empty-placeholder v-else :loaded="!formula_list_loading" :tag="'div'" :width="'100%'" :height="'30px'" class="row">
                    <competition-formula-option
                        class="col-md-4 col-lg-3"

                        v-for="formula in formula_list"

                        :formula="formula"
                        :key="formula.id"

                        v-model="choosen_formula_id"
                    />
                </empty-placeholder>
            </div>
        </div>

        <transition-group v-if="null !== choosen_formula_id" name="list" tag="div" class="row">
            <div class="col-lg-6 col-md-12 list-item" v-for="(formula_component, index) in getFormula(choosen_formula_id).component_list" :key="formula_component+index+'formula_'+choosen_formula_id">
                <component :value="formula_config_list[index]" @input="onFormulaConfigUpdate" :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button class="btn float-right btn-outline-success" type="button" @click="save()" :disabled="!can_create_competition">
                    <transition name="fade" mode="out-in">
                        <i v-if="!competition_saving" class="zmdi zmdi-check"></i>
                        <clip-loader v-else :size="'14px'"></clip-loader>
                    </transition>
                    {{ $t("competition-create.action.confirm") }}
                </button>

                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    {{ $t("common.action.step-previous") }}
                </button>
            </div>
        </div>
    </div>
</template>