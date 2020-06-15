<script>
import TWEEN from '@tweenjs/tween.js'

export default {
    props: {
        value: {
            type: Number,
            required: true
        },    
        tweenDuration: {
            type: Number,
            default: 500
        }
    },  
    watch: {
        value(newVal, oldVal) {
            this.tween(oldVal, newVal)
        }
    },  
    data() {
        return {
            tweeningValue: 0
        }
    },  
    mounted() {
        this.tween(0, this.value)
    },  
    methods: {
        tween(start, end) {
            let frameHandler

            const animate = function(currentTime) {
                TWEEN.update(currentTime)
                frameHandler = requestAnimationFrame(animate)
            }  

            const myTween = new TWEEN.Tween({ tweeningValue: start })
                .to({ tweeningValue: end }, this.tweenDuration)
                .onUpdate(() => {
                    this.tweeningValue = myTween._object.tweeningValue.toFixed(0)
                })
                .onComplete(() => {
                    cancelAnimationFrame(frameHandler)
                })
                .start()
            
            frameHandler = requestAnimationFrame(animate)
        }
    }
}
</script>

<template>
    <span class="tweened-number">{{ tweeningValue }}</span>
</template>