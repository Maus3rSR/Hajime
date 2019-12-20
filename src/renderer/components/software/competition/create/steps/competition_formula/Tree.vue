<script>
export default { // TODO shared parent component
    props: {
        value: Object
    },
    methods: {
        update() {
            this.$emit("input", {
                name: this.name,
                tree_configuration: this.config
            })
        }
    },
    watch: {
        config: {
            handler: function() { this.update() },
            deep: true,
            immediate: true
        },
        value: function () { if (undefined == this.value) this.update() }
    },
    data() {
        return {
            name: "Arbre éliminatoire",
            config: {
                dismiss_favorite: false,
                third_place: false,
                locked: false
            }
        }
    },
    mounted() {
        if (undefined !== this.value)
            this.config = this.value.tree_configuration
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">Configuration de l'arbre éliminatoire</div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.dismiss_favorite">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Ecarter les têtes de séries (favoris)</span>
                    </label>
                </div>
                <div class="col-md-6">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.third_place">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Match pour la 3ème place</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>