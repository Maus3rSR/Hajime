<script>
import Pool from './Component'

import { setupVueI18nMessages } from '@config/i18n'
import translations from '@lang/screens/partials/list/pool/messages'

export default {
    i18n: setupVueI18nMessages(translations),
    props: {
        list: {
            type: Array,
            required: true
        },
        blured: {
            type: Boolean,
            default: false
        },
        canShowDetail: {
            type: Boolean,
            default: false
        }
    },
    components: { Pool },
    methods: {
        openModalPoolRankingDetail(pool) {
            this.modal_pool = pool
            this.showModal = true
        }
    },
    data() {
        return {
            showModal: false,
            modal_pool: null,
        }
    }
}
</script>

<template>
    <div>
        <transition-group name="list" tag="div" class="row">
            <div class="col-lg-6 col-xl-4 list-item" v-for="pool in list" :key="pool.number">
                <pool :pool="pool" :blured="blured" :canShowDetail="canShowDetail" @on-show-detail="openModalPoolRankingDetail(pool)" />
            </div>
        </transition-group>

        <b-modal :title="$t('pool-list.ranking-detail')" v-model="showModal" size="lg">
            
            <table v-if="null !== this.modal_pool" class="table table-striped table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{{ $t("common.entry") }}</th>
                        <th>{{ $t("common.points") }}</th>
                        <th>{{ $t("pool-list.number.victory") }}</th>
                        <th>{{ $t("pool-list.number.score-given") }}</th>
                        <th>{{ $t("pool-list.number.score-received") }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="pool_entry in modal_pool.entry_list" :key="pool_entry.id">
                        <td>{{ pool_entry.rank_number }}</td>
                        <td>{{ pool_entry.entry.name }}</td>
                        <td>{{ pool_entry.score }}</td>
                        <td>{{ pool_entry.victory_number }}</td>
                        <td>{{ pool_entry.score_given_number }}</td>
                        <td>{{ pool_entry.score_received_number }}</td>
                    </tr>
                </tbody>
            </table>

            <template slot="modal-footer">
                <button type="button" class="btn btn-primary" @click.prevent="showModal = false">{{ $t("common.action.close") }}</button>
            </template>
        </b-modal>
    </div>
</template>
