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
                parseFloat(computedRootElement.borderBottomWidth) -
                // All element offset defined manually in the page to consider in the calculation
                this.getElementListOffsetValue()
            ) + "px"

//             console.log(`

// SoftwareContainer ID ${this._uid}
// ---------------------------------

// =============================== ${this.limitContainer}:
// top position                    ${rectLimitElement.top}

// =============================== this.$el :
// top position                    ${rectRootElement.top}
// padding top                     ${computedRootElement.paddingTop}
// padding bottom                  ${computedRootElement.paddingBottom}
// margin top                      ${computedRootElement.marginTop}
// margin bottom                   ${computedRootElement.marginBottom}
// border top                      ${computedRootElement.borderTopWidth}
// border bottom                   ${computedRootElement.borderBottomWidth}

// =============================== Elements offset :
// nb element offset               ${this.getElementList().length}
// total offset                    ${this.getElementListOffsetValue()}

// =============================== Height calculation :
// ${rectLimitElement.top} -
// ${rectRootElement.top} -
// ${parseFloat(computedRootElement.paddingTop)} -
// ${parseFloat(computedRootElement.paddingBottom)} -
// ${parseFloat(computedRootElement.marginBottom)} -
// ${parseFloat(computedRootElement.marginTop)} -
// ${parseFloat(computedRootElement.borderTopWidth)} -
// ${parseFloat(computedRootElement.borderBottomWidth)} -
// ${this.getElementListOffsetValue()}

// = ${this.height}px
//             `)

            if (!this.elementScroll) {
                this.$el.classList.add("software__container--scroll")
                return
            }

            let element = document.getElementById(this.elementScroll)
            if (null === element)
                return
            
            element.classList.add("software__container__child--scroll")
            
            do {
                element.classList.add("software__container__child")
                element = element.parentNode
            } while (!element.className.includes("software__container"))
        },
        getElementList() {
            return Array.from(document.getElementsByClassName("software__container--offset-element"))
        },
        getElementListOffsetValue() {
            return this.getElementList().reduce((total_value, element) => {
                
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
        this.$softwareContainer.$on('forceResize', () => this.$nextTick(function() { this.resize() }))
    },
    mounted() {
        window.addEventListener('resize', this.resize)
        this.resize()
        // this.$nextTick(function() { this.resize() })
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
