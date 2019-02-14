<script>
import { mapGetters } from 'vuex'
import * as FormulaSettingsFormList from '@partials/competitionFormula/settingsForm'

export default {
    components: { ...FormulaSettingsFormList },
    computed: {
        ...mapGetters({
            formula_list: "formula/list"
        })
    },
    actions: {},
    data() {
        return {
            formula: null
        }
    },
    mounted() {
        this.formula = this.formula_list[0]
    }
}
</script>

<template>
    <div>
        <div class=" form-group row">
            <label class="col-sm-3 col-form-label card-body__title" for="competition_formula">Choisir une formule de compétition</label>
            <div class="col-sm-9">
                <select class="form-control" id="competition_formula" v-model="formula">
                    <option v-for="formula in formula_list" :value="formula" :key="formula.id">
                        {{ formula.name }}
                    </option>
                </select>
            </div>
        </div>

        <transition-group name="list" tag="div" class="row" v-if="null != formula">
            <div class="col-lg-6 col-md-12 list-item" v-for="formula_component in formula.component_list" :key="formula_component">
                <component :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button class="btn float-right btn-outline-success animated tada" type="button" @click="$emit('onValidate')">
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