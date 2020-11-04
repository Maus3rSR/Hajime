<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'

import { createVueI18nInstance } from '@config/i18n'
import competitionTranslations from '@lang/generic/competition/messages'
import manageTranslations from '@lang/screens/software/competition/manage/messages'

import * as FormulaTabsManagementList from './manage/steps/competition_formula'
import FighterCall from './manage/steps/FighterCall'

export default {
    i18n: createVueI18nInstance(competitionTranslations, manageTranslations),
    props: {
        id: {
            required: true
        }
    },
    components: { FighterCall, ...FormulaTabsManagementList },
    computed: {
        ...mapState('competition', { competition: state => state.model }),
        ...mapGetters({
            is_competition_empty: "competition/is_empty",
            is_competition_loading: "competition/loading",
            is_competition_saving: "competition/saving",
            entry_present_count: "competition/entry_present_count",
            formula_list_count: "formula/count",
            getFormulaComponentList: "formula/getFormulaComponentList",
        }),
        step_component() {
            return this.step_list[this.current_step-1]
        },
        step_component_name() {
            return this.step_component.component_name
        },
        step_list() {
            let l = [{
                name: this.$t("competition-manage.list-call"),
                component_name: "FighterCall",
                count: this.entry_present_count
            }]
            
            const formula_component_list = this.getFormulaComponentList(this.competition.choosen_formula_id)
            formula_component_list.forEach((component_name, index) => {
                if (undefined == this.competition.formula_config_list[index])
                    return

                l.push({
                    name: this.competition.formula_config_list[index].name,
                    component_name: component_name,
                    competition_formula_id: this.competition.formula_config_list[index].id
                })
            })

            return l
        },
        is_last_step() {
            return this.current_step == this.step_list.length
        }
    },
    methods: {
        ...mapActions({
            lockCompetition: "competition/LOCK",
            loadCompetition: "competition/LOAD",
            loadFormulaList: "formula/LOAD_ALL",
        }),
        nextStep() {
            this.current_step = this.current_step + 1
        },
        previousStep() {
            this.current_step = this.current_step - 1
        },
        goToStep(step) {
            if (this.current_step <= step)
                return

            this.current_step = step
        },
    },
    data() {
        return {
            current_step: 1,
        }
    },
    created() {
        if (this.id !== this.competition.id)
            this.loadCompetition(this.id)

        if (this.formula_list_count === 0)
            this.loadFormulaList()
    }
}
</script>

<template>
    <section id="competition__manage">
        <header class="content__title">
            <template v-if="is_competition_loading || !is_competition_empty">
                <empty-placeholder :loaded="!is_competition_empty" :tag="'h1'">
                    {{ competition.name }}
                </empty-placeholder>
                <empty-placeholder :loaded="!is_competition_empty" :tag="'small'" :width="'5%'" :height="'10px'">
                - {{ competition.date | luxon:locale('date_short') }}
                </empty-placeholder>
                <empty-placeholder :loaded="!is_competition_empty" :tag="'small'" :width="'5%'" :height="'10px'">
                    <template v-if="competition.locked">
                        <span class="badge badge-success">{{ $t('competition.status.finished') | uppercase }}</span>
                    </template>
                    <template v-else-if="competition.locked_entry_list">
                        <span class="badge badge-warning">{{ $t('competition.status.ongoing') | uppercase }}</span>
                    </template>
                    <template v-else>
                        <span class="badge badge-dark">{{ $t('competition.status.waiting') | uppercase }}</span>
                    </template>
                </empty-placeholder>
            </template>

            <div class="actions">
                <transition name="fade" mode="out-in">
                    <button v-if="current_step > 1" class="btn btn-dark" :title="$t('common.action.step-previous')" @click.prevent="previousStep()">
                        <i class="zmdi zmdi-arrow-left"></i>
                    </button>
                </transition>

                <router-link to="/" :title="$t('common.action.back-main')" class="btn btn-dark">
                    <i class="zmdi zmdi-home"></i>
                </router-link>
            </div>
        </header>

        <div class="card">
            <div class="card-body">
                <transition name="fade" mode="out-in" appear>
                    <div v-if="is_competition_empty && !is_competition_loading" class="text-center">
                        <h1>{{ $t("competition.empty") }} :'(</h1>
                    </div>

                    <clip-loader v-else-if="is_competition_loading" :color="'#fff'"></clip-loader>

                    <span v-else>
                        <transition name="fade" type="out-in" appear>
                            <nav aria-label="step-wizard" role="navigation">
                                <ol class="breadcrumb mb-3 software__container--offset-element">
                                    <li v-for="(step, index) in step_list" :key="index" @click="goToStep(index+1)" class="breadcrumb-item" :class="{ active: current_step >= index+1 }">
                                        {{ index+1 }}. {{ step.name }} <span v-if="null !== step.count" class="badge badge-pill badge-primary">{{ step.count }}</span>
                                    </li>
                                </ol>
                            </nav>
                        </transition>

                        <transition name="fade" mode="out-in">
                            <component
                                :is="step_component_name"
                                :formula_id="step_component.competition_formula_id"
                                :is_last="is_last_step"
                                
                                @onValidate="is_last_step ? lockCompetition() : nextStep()"
                                @onBack="previousStep()"
                            >
                            
                                <template v-if="competition.locked" slot="confirmation-section">
                                    <span class="float-right btn">
                                        {{ $t("competition.closed") }} <i class="zmdi zmdi-lock"></i>
                                    </span>
                                </template>

                                <template v-if="is_last_step" slot="validate-button-content">
                                    {{ $t("competition.action.close") }}
                                    <transition name="fade" mode="out-in">
                                        <clip-loader v-if="is_competition_saving" color="#ffffff" size="14px"></clip-loader>
                                        <i v-else class="zmdi zmdi-check"></i>
                                    </transition>
                                </template>
                            
                            </component>
                        </transition>
                    </span>
                </transition>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
header.content__title {
    h1 {
        display: inline-block;
    }

    small {
        display: inline-block;
        margin: 0;
    }
}
</style>

<style lang="scss">
#competition__manage {
    .tab-content {
        padding: 0;
    }
    .breadcrumb-item.active {
        cursor: pointer;
    }
}
</style>
