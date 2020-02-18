<script>
import { mapState } from 'vuex'

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
        ...mapState('configuration', ["FIGHT_NB_FOOL_GIVE_IPPON","FIGHT_FOOL_CODE"]),
        score_length() {
            return this.score_list.length
        },
        last_score_index() {
            return this.score_length - 1
        },
        limit_score_reached() {
            if (this.limit === 0)
                return false

            return this.score_length >= this.limit
        }
    },
    methods: {
        onAdd(ev) {
            if (ev.newIndex !== this.last_score_index)
                this.score_list.splice(this.last_score_index, 0, this.score_list.splice(ev.newIndex, 1)[0]);

            const last_item_added = this.score_list[this.last_score_index]

            if (last_item_added.code === this.FIGHT_FOOL_CODE) {
                this.score_list.splice(this.last_score_index)
                this.addFool()
            }
        },
        addScore(score) {
            if (this.limit_score_reached)
                return

            this.score_list.push(score)
        },
        addFool() {
            if (this.limit_score_reached)
                return

            this.fool_count++

            if (this.fool_count > 0 && this.fool_count % this.FIGHT_NB_FOOL_GIVE_IPPON === 0)
                this.$emit('on-fool-reached')
        }
    },
    data() {
        return {
            score_list: [],
            fool_count: 0,
        }
    }
}
</script>

<template>
    <div class="card score-drag-container" :class="{ 'ripple-out': scoreChoosen && !limit_score_reached }">
        <draggable
            class="card-body"

            :list="score_list"
            :group="{ name: 'score', pull: false, put: true }"
            :sort="false"
            :disabled="limit_score_reached"
            
            @add="onAdd"
        >
            <span v-for="(score, index) in score_list" :key="index" :title="score.name" class="">
                {{ score.code }}
            </span>

        </draggable>
            <span v-for="fool_number in fool_count" :key="fool_number">
                {{ FIGHT_FOOL_CODE }}
            </span>
    </div>
</template>