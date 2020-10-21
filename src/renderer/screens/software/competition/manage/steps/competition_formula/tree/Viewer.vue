<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    components: {},
    computed: {},
    methods: {
        ...mapActions({
            GeneratePdf: "pool/GENERATE_PDF"
        })
    },
    data() {
        return {}
    }
}
</script>

<template>
    <div>
        <div class="toolbar">
            <div class="toolbar__label">
                Label arbre éliminatoire
            </div>

            <div class="actions">
                <a href="javascript:void(0);" @click.prevent="GeneratePdf" title="Télécharger le PDF de l'arbre éliminatoire" class="actions__item zmdi zmdi-collection-pdf"></a>
            </div>
        </div>

        <software-container limit-container="software__footer" element-scroll="">

        </software-container>
    </div>
</template>
