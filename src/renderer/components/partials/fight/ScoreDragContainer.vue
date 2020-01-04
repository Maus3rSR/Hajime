<script>
export default {
    props: {
        scoreChoosen: {
            type: Boolean,
            required: true
        },
        limit: {
            type: Number,
            default: 0
        }
    },
    computed: {
        score_length() {
            return this.score_list.length
        },
        can_put() {
            return this.score_length < this.limit || this.limit === 0
        }
    },
    data() {
        return {
            score_list: []
        }
    }
}
</script>

<template>
    <div class="card score-drag-container" :class="{ 'ripple-out': scoreChoosen && can_put }">
        <draggable
            class="card-body"

            :list="score_list"
            :group="{ name: 'score', pull: false, put: can_put }"
            :sort="false"
        >
            <span v-for="(score, index) in score_list" :key="index" :title="score.name" class="">
                {{ score.code }}
            </span>
        </draggable>
    </div>
</template>