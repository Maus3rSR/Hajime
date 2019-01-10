<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        step_is_valid() {
            return this.list.length > 0
        }
    },
    methods: {},
    data() {
        return {
            list: [],
        }
    }
}
</script>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <fighter-import />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success': step_is_valid}" class="btn float-right" @click="$emit('onValidate')">
                    Etape suivante
                    <i class="zmdi zmdi-arrow-right"></i>
                </button>
                
                <button class="btn btn-link float-right mr-2" @click="$emit('onBack')">
                    <i class="zmdi zmdi-arrow-left"></i>
                    Etape précédente
                </button>
            </div>
        </div>
    </div>
</template>
