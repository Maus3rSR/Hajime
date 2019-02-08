<script>
import { mapGetters } from 'vuex'

export default {
    components: {},
    computed: {
        step_is_valid() {
            return false
        }
    },
    actions: {}
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success': step_is_valid}" type="button" class="btn float-right" @click="$emit('onValidate')">
                    Je confirme la création de la compétition
                    <i class="zmdi zmdi-check"></i>
                </button>

                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Etape précédente
                </button>
            </div>
        </div>
    </div>
</template>