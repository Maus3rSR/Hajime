<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import { createVueI18nInstance } from '@config/i18n'
import competitionTranslations from '@lang/generic/competition/messages'
import dashboardTranslations from  '@lang/screens/software/dashboard/messages'

export default {
    i18n: createVueI18nInstance(competitionTranslations, dashboardTranslations),
    computed: {
        ...mapState('competition', {
            competition_list: 'list',
            competition_list_total: 'list_total',
        }),
        ...mapGetters({
            competition_list_loading: 'competition/list_loading',
            competition_type_list: "competition/type_list",
        }),
        competition_column_list() {
            return [
                { label: this.$t("common.name"), field: "name" },
                { label: this.$t("common.date"), field: "date" },
                { label: this.$t("common.place"), field: "place" },
                { label: this.$t("common.organizer"), field: "owner" },
                { label: this.$t("common.type"), field: "type" },
                { label: this.$t("common.status"), field: "status" },
                { label: "", field: "action-cell" }
            ]
        }
    },
    methods: {
        ...mapActions({
            loadCompetitionList: 'competition/LOAD_LIST'
        }),
        getCompetitionTypeLabel(type) {
            return this.competition_type_list.find(el => el.value === type).name
        }
    }
}
</script>

<template>
    <div id="dashboard">
        <div class="row">
            <div class="col-md-12 col-lg-6">
                <!-- Competition -->
                <div class="card">
                    <img class="card-img" src="~@images/software/competition-bg.png">

                    <div class="card-img-overlay">
                        <div class="card-body">
                            <h4 class="card-title">{{ $t("common.competition") }}</h4>

                            <router-link class="card-link btn btn-light btn--icon-text" :to="{ name: 'create-competition'}">
                                <i class="zmdi zmdi-plus"></i>
                                {{ $t("dashboard.competition.create") }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-lg-6">
                <data-list
                    name="competitionList"
                    :title="$t('common.of.list', { item: this.$options.filters.lowercase($t('common.competitions')) })"

                    @on-load="loadCompetitionList"

                    :list="competition_list"
                    :total="competition_list_total"
                    :loading="competition_list_loading"
                    :columns="competition_column_list"
                    :sortColumn="false"
                >

                    <template slot="date" slot-scope="props">
                        {{ props.row.date | luxon:locale('date_short') }}
                    </template>

                    <template slot="type" slot-scope="props">
                        {{ getCompetitionTypeLabel(props.row.type) }}
                    </template>

                    <template slot="status" slot-scope="props">
                        <template v-if="props.row.locked">
                            <span class="badge badge-success">{{ $t('competition.status.finished') | uppercase }}</span>
                        </template>
                        <template v-else-if="props.row.locked_entry_list">
                            <span class="badge badge-warning">{{ $t('competition.status.ongoing') | uppercase }}</span>
                        </template>
                        <template v-else>
                            <span class="badge badge-dark">{{ $t('competition.status.waiting') | uppercase }}</span>
                        </template>
                    </template>

                    <template slot="action-cell" slot-scope="props">

                        <router-link :title="$t('dashboard.competition.goto')" class="btn btn-sm btn-outline-primary" :to="{ name: 'manage-competition', params: { id: props.row.id } }">
                            <i class="zmdi zmdi-arrow-right"></i>
                        </router-link>
                    </template>

                </data-list>
            </div>

            <!-- Passage de grade -->
            <!-- <div class="col-md-12 col-lg-6">
                <div class="card">
                    <img class="card-img" src="~@images/software/passage-grade-bg.png">

                    <div class="card-img-overlay">
                        <div class="card-body">
                            <h4 class="card-title">Passage de grade</h4>

                            <p class="card-text">
                                <span class="badge badge-warning text-white">
                                    <i class="zmdi zmdi-alert-triangle"></i>
                                    DEVELOPPEMENT EN COURS
                                </span>
                            </p>

                            <a class="card-link btn btn-light btn--icon-text disabled" href="javascript:void(0);">
                                <i class="zmdi zmdi-plus"></i>
                                Créer un nouveau passage de grade
                            </a>
                        </div>
                    </div>
                </div>

                <data-list
                    name="graduationList"
                    title="Liste des passages de grade"

                    :isDynamic="false"
                >
                </data-list>
            </div> -->
        </div>

    </div>
</template>

<style lang="scss">

</style>
