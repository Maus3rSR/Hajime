<script>
import Pool from './Component'

export default {
    props: {
        list: {
            type: Array,
            required: true
        },
        entry_field: {
            type: String,
            required: false,
            default: "entry"
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
                <pool :pool="pool" :entry_field="entry_field" :blured="blured" :canShowDetail="canShowDetail" @on-show-detail="openModalPoolRankingDetail(pool)" />
            </div>
        </transition-group>

        <b-modal title="Détail du classement" v-model="showModal" size="lg">
            
            <table v-if="null !== this.modal_pool" class="table table-striped table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Combattant</th>
                        <th>Points</th>
                        <th>Nombre de victoire</th>
                        <th>Nombre de ippons marqués</th>
                        <th>Nombre de ippons reçus</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="entry in modal_pool.entry_list" :key="entry.id">
                        <td>{{ entry.rank_number }}</td>
                        <td>{{ entry[entry_field].name }}</td>
                        <td>{{ entry.score }}</td>
                        <td>{{ entry.victory_number }}</td>
                        <td>{{ entry.score_given_number }}</td>
                        <td>{{ entry.score_received_number }}</td>
                    </tr>
                </tbody>
            </table>

            <template slot="modal-footer">
                <button type="button" class="btn btn-primary" @click.prevent="showModal = false">Fermer</button>
            </template>
        </b-modal>
    </div>
</template>
