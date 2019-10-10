<script>
export default { // TODO shared parent component
    props: {
        value: Object
    },
    methods: {
        update() {
            this.$emit("input", {
                name: this.name,
                pool: this.config
            })
        }
    },
    watch: {
        config: {
            handler: function() { this.update() },
            deep: true,
            immediate: true
        },
        value: function () { if (undefined === this.value) this.update() }
    },
    data() {
        return {
            name: "Matchs de poule",
            config: {
                number_of_qualified_fighter: 1,
                dismiss_favorite: false,
                lock: false
            }
        }
    },
    mounted() {
        if (undefined !== this.value)
            this.config = this.value.pool
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">Configuration des matchs de poule</div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <label for="pool_configuration__number_of_qualified_fighter" class="card-body__title">Nombre de combattants qualifiés par poule</label>
                        <input id="pool_configuration__number_of_qualified_fighter" type="number" min="1" class="form-control" v-model="config.number_of_qualified_fighter">
                        <i class="form-group__bar"></i>
                    </div>
                </div>

                <div class="col-md-6">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.dismiss_favorite">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Ecarter les têtes de séries (favoris)</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

