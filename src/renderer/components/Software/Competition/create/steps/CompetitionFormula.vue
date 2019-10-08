<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import * as FormulaSettingsFormList from './competition_formula'

export default {
    components: { ...FormulaSettingsFormList },
    computed: {
        ...mapState('formula', {
            formula_list_loading: state => state.loading
        }),
        ...mapGetters({
            competition_saving: "competition/saving",
            formula_list: "formula/list",
            formula_count: "formula/count",
            getFormula: "formula/getFormula"
        }),
        ...mapFields('competition', ['model.choosen_formula_id', 'model.formula_config_list']),
        can_create_competition() {
            return this.formula_count == 0 || this.competition_saving
        }
    },
    methods: {
        ...mapActions({
            loadFormulaList: "formula/LOAD_ALL",
            saveFormulaConfig: "competition/SAVE_FORMULA_CONFIG",
            saveCompetition: "competition/CREATE"
        }),
        save() {
            if (this.competition_saving) return
            this.saveCompetition().then(() => this.$emit('onValidate'))
        }
    },
    watch: {
        choosen_formula_id: {
            handler: function () {
                this.formula_config_list = []
            }
        },
        formula_list: {
            handler: function (new_list) {
                if (null == this.choosen_formula_id && new_list.length)
                    this.choosen_formula_id = this.formula_list[0].id
            },
            immediate: true
        }
    },
    created() {
        if (this.formula_list.length === 0)
            this.loadFormulaList()
    }
}
</script>

<template>
    <div>
        <div class="form-group row">
            <label class="col-sm-3 col-form-label card-body__title" for="competition_formula">Choisir une formule de compétition</label>
            <div class="col-sm-9">
                <div v-if="formula_count == 0 && !formula_list_loading" class="h4 alert alert-warning">
                    <i class="zmdi zmdi-alert-triangle"></i>
                    La liste des formules de compétition est vide :(
                </div>
                <empty-placeholder v-else :loaded="!formula_list_loading" :tag="'div'" :width="'100%'" :height="'30px'">
                    <select class="form-control" id="competition_formula" v-model="choosen_formula_id">
                        <option v-for="formula in formula_list" :value="formula.id" :key="formula.id">
                            {{ formula.name }}
                        </option>
                    </select>
                </empty-placeholder>
            </div>
        </div>

        <transition-group v-if="null != choosen_formula_id" name="list" tag="div" class="row">
            <div class="col-lg-6 col-md-12 list-item" v-for="(formula_component, index) in getFormula(choosen_formula_id).component_list" :key="formula_component+index+'formula_'+choosen_formula_id">
                <component :value="formula_config_list[index]" @input="saveFormulaConfig" :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button class="btn float-right btn-outline-success" type="button" @click="save()" :disabled="can_create_competition">
                    <transition name="fade" mode="out-in">
                        <i v-if="!competition_saving" class="zmdi zmdi-check"></i>
                        <clip-loader v-else :size="'14px'"></clip-loader>
                    </transition>
                    Je confirme la création de la compétition
                </button>

                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Etape précédente
                </button>
            </div>
        </div>
    </div>
</template>