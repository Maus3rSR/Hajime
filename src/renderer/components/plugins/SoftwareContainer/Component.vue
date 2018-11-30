<script>
export default {
    props: {
        limitContainer: {
            type: String,
            required: true
        },
        elementScroll: {
            type: String
        }
    },
    computed: {
        style() {
            if (null === this.height) {
                return {}
            }

            return {
                height: this.height
            }
        }
    },
    methods: {
        resize() {
            const computedRootElement = window.getComputedStyle(this.$el),
                rectRootElement = this.$el.getBoundingClientRect(),
                rectLimitElement = document.getElementById(this.limitContainer).getBoundingClientRect()

            this.height = (
                rectLimitElement.top -
                rectRootElement.top -
                // Padding
                parseFloat(computedRootElement.paddingTop) -
                parseFloat(computedRootElement.paddingBottom) -
                // Margin
                parseFloat(computedRootElement.marginBottom) -
                parseFloat(computedRootElement.marginTop) -
                // Border
                parseFloat(computedRootElement.borderTopWidth) -
                parseFloat(computedRootElement.borderBottomWidth)
            ) + "px"

            if (!this.elementScroll) {
                this.$el.classList.add("software__container--scroll")
                return;
            }

            let element = document.getElementById(this.elementScroll)
            if (null === element) {
                return
            }
            
            element.classList.add("software__container__child--scroll")
            while (element !== this.$el) {
                element.classList.add("software__container__child")
                element = element.parentNode
            }
        }
    },
    data() {
        return {
            height: null
        }
    },
    mounted() {
        window.onresize = this.resize
        this.resize()
    }
}
</script>

<template>
    <div class="software__container" :style="style">
        <slot></slot>
    </div>
</template>

<style lang="scss">
    .software__container {
        &.software__container--scroll {
            overflow-y: auto;
        }
    }

    .software__container__child {
        height: 100%;
        overflow: hidden;
        
        &.software__container__child--scroll {
            padding-top: 5px;
            overflow-y: auto;
        }
    }
</style>
