<script>
import { setupVueI18nMessages } from '@config/i18n'
import createTranslations from '@lang/screens/software/competition/create/messages'

export default { // TODO shared parent component
    i18n: setupVueI18nMessages(createTranslations),
    props: {
        value: Object
    },
    methods: {
        update() {
            this.$emit("input", {
                name: this.name,
                pool_configuration: this.config
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
            name: "Poule",
            config: {
                number_of_qualified_fighter: 1,
                repulse_favorite: false,
                repulse_club: false,
                locked: false
            }
        }
    },
    created() {
        if (undefined !== this.value) {
            this.config = this.value.pool_configuration
            this.update()
        }
    }
}
</script>

<template>
    <div class="card">
        <div class="card-header">{{ $t("competition-create.formula.pool.card-title") }}</div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-12">
                    <div class="form-group">
                        <label for="pool_configuration__number_of_qualified_fighter" class="card-body__title">{{ $t("competition-create.formula.pool.qualified-number") }}</label>
                        <input id="pool_configuration__number_of_qualified_fighter" type="number" min="1" class="form-control" v-model="config.number_of_qualified_fighter">
                        <i class="form-group__bar"></i>
                    </div>
                </div>

                <div class="col-md-12">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.repulse_favorite">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{ $t("competition-create.formula.repulse-favorite") }} (<i class="zmdi zmdi-star text-yellow"></i>)</span>
                    </label>
                </div>

                <div class="col-md-12">
                    <label class="ml-2 custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" v-model="config.repulse_club">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">{{ $t("competition-create.formula.repulse-club") }}</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>