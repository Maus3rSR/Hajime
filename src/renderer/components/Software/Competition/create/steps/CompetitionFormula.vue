<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import * as FormulaSettingsFormList from './competition_formula'

export default {
    components: { ...FormulaSettingsFormList },
    computed: {
        ...mapState('competition', {
            formula_config_list: state => state.model.formula_config_list
        }),
        ...mapGetters({
            competition_saving: "competition/saving",
            formula_list: "formula/list",
            getFormula: "formula/getFormula"
        }),
        ...mapFields('competition', ['model.choosen_formula_id']),
    },
    methods: {
        ...mapMutations({
            resetFormulaConfig: "competition/RESET_FORMULA_CONFIG_LIST"
        }),
        ...mapActions({
            saveFormulaConfig: "competition/SAVE_FORMULA_CONFIG",
            saveCompetition: "competition/SAVE"
        }),
        save() {
            if (this.competition_saving) return
            this.saveCompetition().then(() => this.$emit('onValidate'))
        }
    },
    watch: {
        choosen_formula_id: {
            handler: function () {
                this.resetFormulaConfig()
            }
        }
    },
    mounted() {
        if (null == this.choosen_formula_id)
            this.choosen_formula_id = this.formula_list[0].id
    }
}
</script>

<template>
    <div>
        <div class=" form-group row">
            <label class="col-sm-3 col-form-label card-body__title" for="competition_formula">Choisir une formule de compétition</label>
            <div class="col-sm-9">
                <select class="form-control" id="competition_formula" v-model="choosen_formula_id">
                    <option v-for="formula in formula_list" :value="formula.id" :key="formula.id">
                        {{ formula.name }}
                    </option>
                </select>
            </div>
        </div>

        <transition-group v-if="null != choosen_formula_id" name="list" tag="div" class="row">
            <div class="col-lg-6 col-md-12 list-item" v-for="(formula_component, index) in getFormula(choosen_formula_id).component_list" :key="formula_component+index+'formula_'+choosen_formula_id">
                <component :value="formula_config_list[index]" @input="saveFormulaConfig" :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button class="btn float-right btn-outline-success" type="button" @click="save()" :disabled="competition_saving">
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