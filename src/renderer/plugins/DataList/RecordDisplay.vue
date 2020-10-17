<script>
export default {
    components: {},
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

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/plugins/datalist.json"></i18n>

<template>
    <span class="record-display-component">
        <a :id="id_component" href="javascript:void(0)" class="badge badge-pill">{{ $t("datalist.display") }} / {{ current }}</a>
        <b-popover 
            placement="auto"
            triggers="click"
            
            :title="$t('datalist.line')"
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