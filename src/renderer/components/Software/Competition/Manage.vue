<script>
import { mapActions, mapGetters, mapState } from 'vuex'
export default {
    props: {
        id: {
            required: true
        }
    },
    components: {},
    computed: {
        ...mapState('competition', {
            competition_id: state => state.model.id,
            competition_name: state => state.model.name,
            competition_date: state => state.model.date,
        }),
        ...mapGetters({
            isEmptyCompetition: "competition/isEmpty"
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
    }
}
</script>

<template>
    <div id="competition__manage">
        <header class="content__title">
            <empty-placeholder :loaded="!isEmptyCompetition" :tag="'h1'">
                {{ competition_name }}
            </empty-placeholder>
            <empty-placeholder :loaded="!isEmptyCompetition" :tag="'small'" :width="'5%'" :height="'10px'">
                Du {{ competition_date }}
            </empty-placeholder>

            <div class="actions">
                <router-link to="/" title="Revenir à l'écran principal" class="btn btn-dark">
                    <i class="zmdi zmdi-home"></i>
                </router-link>
            </div>
        </header>
    </div>
</template>