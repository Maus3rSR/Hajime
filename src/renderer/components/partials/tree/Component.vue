<script>
const DISPLAY = {
    DEFAULT: 'DEFAULT',
    WIDE: 'WIDE'
}

export default {
    props: {
        id: {
            type: String,
            required: false,
            default: "default"
        }
    },
    computed: {
        id_component() {
            return `canvas-tree-${this.id}`
        },
        total_round() {
            return Math.sqrt(this.size)
        }
    },
    methods: {
        setup() {
            this.canvas.element = document.getElementById(this.id_component)
            this.ctx = this.canvas.element.getContext("2d")
            
            const dpi = window.devicePixelRatio
            this.canvas.height = +getComputedStyle(this.canvas.element).getPropertyValue("height").slice(0, -2) * dpi
            this.canvas.width = +getComputedStyle(this.canvas.element).getPropertyValue("width").slice(0, -2) * dpi

            this.canvas.element.setAttribute('height', this.canvas.height);
            this.canvas.element.setAttribute('width', this.canvas.width);
        },
        draw() {
            const nb_column = this.display_type === DISPLAY.WIDE ? this.total_round * 2 - 1 : this.total_round
            const column_width = this.canvas.height / nb_column
            const space_column = 0
            const space_cell = 0
            const cell_height = 5

            // for (let number_of_cell = this.size; number_of_cell > 1; number_of_cell = number_of_cell / 2) {
            //     for (let cell_number = number_of_cell; cell_number > 0; cell_number--) {

            //         const x
            //         const y
            //         this.drawCell(x, y, column_width, cell_height)
            //     }
            // }
        },
        drawCell(x, y, width, height) {

        },
        drawLine(x1, x2, y1, y2) {

        }
    },
    mounted() {
        this.setup()
        this.draw()
    },
    data() {
        return {
            canvas: { element: null, height: null, width: null },
            dpi: null,
            ctx: null,
            size: 16,
            display_type: DISPLAY.WIDE
        }
    }
}
</script>

<template>
    <canvas :id="id_component"></canvas>
</template>

<style lang="scss" scoped>
    canvas {
        width: 100%;
        height: 100%;
    }
</style>