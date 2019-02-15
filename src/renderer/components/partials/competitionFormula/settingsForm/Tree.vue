<script>
export default {
    props: {
        value: Array
    },
    watch: {
        config: {
            handler: function () {
                this.$emit('value', {
                    name: this.name,
                    ...this.config
                })
            },
            deep: true,
            immediate: true
        }
    },
    data() {
        return {
            name: "Arbre éliminatoire",
            config: {
                dismiss_favorite: false,
                third_place_match: false,
            }
        }
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
                        <span class="custom-control-description">Ecarter les têtes de séries</span>
                    </label>
                </div>
                <div class="col-md-6">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.third_place_match">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">Match pour la 3ème place</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>

