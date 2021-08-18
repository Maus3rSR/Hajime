<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'Software',
})
</script>

<template>
    <main id="software" data-theme="luxury">
        <button class="btn btn-active" role="button" aria-pressed="true">
            neutral
        </button>
        <button
            class="btn btn-primary btn-active"
            role="button"
            aria-pressed="true"
        >
            primary
        </button>
        <button
            class="btn btn-secondary btn-active"
            role="button"
            aria-pressed="true"
        >
            secondary
        </button>
        <button
            class="btn btn-accent btn-active"
            role="button"
            aria-pressed="true"
        >
            accent
        </button>
        <button
            class="btn btn-link btn-active"
            role="button"
            aria-pressed="true"
        >
            link
        </button>
    </main>
</template>

<style>
@import 'animate.css/animate.css';
</style>
