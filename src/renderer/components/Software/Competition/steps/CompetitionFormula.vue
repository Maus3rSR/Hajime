<script>
import { mapGetters } from 'vuex'
import * as FormulaSettingsFormList from '@partials/competitionFormula/settingsForm'

export default {
    components: { ...FormulaSettingsFormList },
    computed: {
        ...mapGetters({
            formula_list: "formula/list"
        }),
        step_is_valid() {
            return false
        }
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
        <div class="row">
            <div class="col-sm-3">
                <div class="form-group">
                    <label for="competition_formula" class="card-body__title">Choisir une formule de compétition</label>
                    <select class="form-control" id="competition_formula" v-model="formula">
                        <option v-for="formula in formula_list" :value="formula" :key="formula.id">
                            {{ formula.name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <transition-group name="list" tag="div" class="row" v-if="null != formula">
            <div class="col-sm-3 list-item" v-for="formula_component in formula.component_list" :key="formula_component">
                <component :is="formula_component"></component>
            </div>
        </transition-group>

        <div class="row">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success': step_is_valid}" type="button" class="btn float-right" @click="$emit('onValidate')">
                    Je confirme la création de la compétition
                    <i class="zmdi zmdi-check"></i>
                </button>

                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Etape précédente
                </button>
            </div>
        </div>
    </div>
</template>