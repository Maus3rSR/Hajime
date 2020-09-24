<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
    components: { InfiniteLoading },
    props: {
        initialPage: {
            type: Number,
            default: 1
        },
        firstPage: {
            type: Number,
            default: 1
        },
        infiniteScrollDistance: {
            type: Number,
            default: 100
        },
        totalPage: {
            type: Number,
            default: -1
        }
    },
    computed: {
        no_more_data() {
            return this.page >= this.totalPage
        }
    },
    methods: {
        loadMore($state) {
            this.infinite_state = $state
            if (this.no_more_data) {
                this.complete()
                return
            }
            this.$emit('on-page-change', this.page)
        },
        complete(cancelled) {
            const method = this.page >= this.totalPage ? 'complete' : 'loaded'

            if(undefined !== this.infinite_state) {
                this.infinite_state[method]()
            }

            if (method === 'complete') {
                /**
                 * Because if we call complete() at the first time
                 * the plugin will not set isFirstLoad to false
                 */
                this.$refs.infiniteLoading.isFirstLoad = false
            }

            if (cancelled !== true) {
                this.page = this.page + 1
            }
        },
        cancel() {
            this.complete(true)
        },
        reset() {
            this.page = this.firstPage
            if(undefined !== this.infinite_state) { 
                this.infinite_state.reset()
            }
            this.$emit('on-page-reset', this.page)
        }
    },
    data() {
        return {
            infinite_state: undefined,
            page: this.initialPage
        }
    },
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/plugins/datalist.json"></i18n>

<template>
    <infinite-loading @infinite="loadMore" :distance="infiniteScrollDistance"  ref="infiniteLoading">

        <template slot="no-more">
            {{ $t("datalist.loaded") }} :-)
        </template>

    </infinite-loading>
</template>
