<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import FighterList from '@partials/list/FighterList/Component'

export default {
    props: {
        id: {
            required: true
        }
    },
    components: { FighterList },
    computed: {
        ...mapState('competition', {
            competition_id: state => state.model.id,
            competition_name: state => state.model.name,
            competition_date: state => state.model.date,
            competition_type: state => state.model.type,
        }),
        ...mapGetters({
            is_empty_competition: "competition/is_empty",
            competition_loading: "competition/loading",
            competition_saving: "competition/saving",
        }),
        ...mapFields('competition', {
            fighter_list: 'model.fighter_list',
        })
    },
    methods: {
        ...mapActions({
            loadCompetition: "competition/LOAD"
        })
    },
    data() {
        return {}
    },
    created() {
        if (this.id !== this.competition_id)
            this.loadCompetition(this.id)
    },
    mounted() {
        
    }
}
</script>

<template>
    <section id="competition__manage">
        <header class="content__title">
            <empty-placeholder :loaded="!is_empty_competition" :tag="'h1'">
                {{ competition_name }}
            </empty-placeholder>
            <empty-placeholder :loaded="!is_empty_competition" :tag="'small'" :width="'5%'" :height="'10px'">
                Du {{ competition_date }}
            </empty-placeholder>

            <div class="actions">
                <router-link to="/" title="Revenir à l'écran principal" class="btn btn-dark">
                    <i class="zmdi zmdi-home"></i>
                </router-link>
            </div>
        </header>

        <div>
            <b-tabs>
                <b-tab title="Liste d'appel" active>
                    <fighter-list ref="fighterList" v-model="fighter_list" :competition_type="competition_type" />
                </b-tab>
            </b-tabs>
        </div>
    </section>
</template>

<style lang="scss" scoped>
h1 {
    display: inline-block;
    + small {
        display: inline-block;
        margin: 0;
    }
}
</style>

<style lang="scss">
#competition__manage .tab-content {
    padding-bottom: 0;
}
</style>
