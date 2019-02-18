<script>
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import * as FormulaSettingsFormList from '@partials/competitionFormula/settingsForm'

export default {
    components: { ...FormulaSettingsFormList },
    computed: {
        ...mapState('competition', {
            formula_config_list: state => state.formula_config_list
        }),
        ...mapGetters({
            formula_list: "formula/list",
            getFormula: "formula/getFormula"
        }),
        ...mapFields('competition', ['choosen_formula_id']),
    },
    methods: {
        ...mapMutations({
            resetFormulaConfig: "competition/RESET_FORMULA_CONFIG_LIST"
        }),
        ...mapActions({
            saveFormulaConfig: "competition/SAVE_FORMULA_CONFIG",
        }),
        generateId() {
            return uuidv4()
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

        <transition-group name="list" tag="div" class="row" v-if="null != choosen_formula_id">
            <div class="col-lg-6 col-md-12 list-item" v-for="(formula_component, index) in getFormula(choosen_formula_id).component_list" :key="formula_component+index">
                <component :value="formula_config_list[index]" @input="saveFormulaConfig" :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button class="btn float-right btn-outline-success" type="button" @click="$emit('onValidate')">
                    <i class="zmdi zmdi-check"></i>
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