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

            // console.log("rectLimitElement TOP", rectLimitElement.top)
            // console.log("rectRootElement TOP", rectRootElement.top)
            // console.log("computedRootElement PADDING TOP", parseFloat(computedRootElement.paddingTop))
            // console.log("computedRootElement PADDING BOTTOM", parseFloat(computedRootElement.paddingBottom))
            // console.log("computedRootElement MARGIN BOTTOM", parseFloat(computedRootElement.marginBottom))
            // console.log("computedRootElement MARGIN TOP", parseFloat(computedRootElement.marginTop))
            // console.log("computedRootElement BORDER WIDTH BOTTOM", parseFloat(computedRootElement.borderBottomWidth))
            // console.log("computedRootElement BORDER WIDTH TOP", parseFloat(computedRootElement.borderTopWidth))
            // console.log("elementListOffsetValue", this.getElementListOffsetValue())

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
                parseFloat(computedRootElement.borderBottomWidth) -
                // All element offset defined manually in the page to consider in the calculation
                this.getElementListOffsetValue()
            ) + "px"

            if (!this.elementScroll) {
                this.$el.classList.add("software__container--scroll")
                return
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
        },
        getElementListOffsetValue() {
            let element_list = document.getElementsByClassName("software__container--offset-element")

            return Array.from(element_list).reduce((total_value, element) => {
                
                const computedRootElement = window.getComputedStyle(element)

                return total_value += (
                    // Height
                    parseFloat(computedRootElement.height) +
                    // Padding
                    parseFloat(computedRootElement.paddingTop) +
                    parseFloat(computedRootElement.paddingBottom) +
                    // Margin - Not to use ... cause issues
                    // parseFloat(computedRootElement.marginBottom) +
                    // parseFloat(computedRootElement.marginTop) +
                    // Border
                    parseFloat(computedRootElement.borderTopWidth) +
                    parseFloat(computedRootElement.borderBottomWidth)
                )

            }, 0)
        }
    },
    data() {
        return {
            height: null
        }
    },
    created() {
        // this.$softwareContainer.addContainer(this)
    },
    mounted() {
        window.onresize = this.resize
        this.resize()
        this.$nextTick(function() { this.resize() })
    },
    destroyed() {
        // this.$softwareContainer.removeContainer(this)
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
