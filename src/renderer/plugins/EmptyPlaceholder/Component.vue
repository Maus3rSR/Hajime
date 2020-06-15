<script>
export default {
    props: {
        loaded: {
            type: Boolean,
            required: true
        },
        tag: {
            type: String,
            default: "div"
        },
        width: {
            type: String,
            default: '10%'
        },
        height: {
            type: String,
            default: '15px'
        }
    },
    computed: {
        emptyContent() {
            if (undefined == this.$slots.default || undefined == this.$slots.elm)
                return true

            return undefined == this.$slots.default[0]
        },
        style() {
            if (this.loaded)
                return {}
            
            return {
                width: this.width,
                height: this.height
            }
        }
    }
}
</script>

<template> 
    <component :is="tag" :style="style" :class="{ empty: !loaded }">
        <slot v-if="loaded"></slot>
    </component>
</template>

<style lang="scss" scoped>
    $color-base: rgba(255, 255, 255, 0.4);
    $color-highlight: darken($color-base, 5%);

    .empty {
        position: relative;
        overflow: hidden;
        background: $color-base;

        &:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, $color-base, $color-highlight, $color-base);
            animation: progress 1s ease-in-out infinite;
        }
    }

    @keyframes progress {
        0% {
            transform: translate3d(-100%, 0, 0);
        }
        100% {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>
