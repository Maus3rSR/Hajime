<script>
import bPopover from 'bootstrap-vue/es/components/popover/popover'

export default {
    components: { bPopover },
    props: {
        name: {
            type: String,
            required: true
        },
        displayBy: {
            type: Array,
            default() {
                return [10, 20, 30]
            }
        }
    },
    computed: {
        id_component() {
            return "record-display__link__" + this.name
        }
    },
    methods: {
        close(number) {
            this.current = number
            this.popoverShow = false
            this.$emit('on-display-change', this.current)
        },
    },
    data() {
        return {
            current: this.displayBy[0],
            popoverShow: false
        }
    },
    mounted() {
        this.$emit('on-display-initial', this.current)
    }
}
</script>

<template>
    <span class="record-display-component">
        <a :id="id_component" href="javascript:void(0)" class="badge badge-pill">Affichage / {{ current }}</a>
        <b-popover 
            placement="auto"
            triggers="click"
            title="Nombre de lignes affichées"
            
            :target="id_component"
            :show.sync="popoverShow"
        >
            <div class="btn-group">
                <button
                    type="button"
                    class="btn btn-light"
                    
                    v-for="number in displayBy"
                    
                    @click="close(number)"

                    :key="number"
                    :class="{ 'active': number === current }"
                >
                    {{ number }}
                </button>
            </div>
        </b-popover>
    </span>
</template>