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
        can_put() {
            return this.score_length < this.limit || this.limit === 0
        }
    },
    methods: {
        onAdd(ev) {
            if (ev.newIndex !== this.last_score_index)
                this.score_list.splice(this.last_score_index, 0, this.score_list.splice(ev.newIndex, 1)[0]);

            const last_item_added = this.score_list[this.last_score_index]

            if (last_item_added.code === this.FIGHT_FOOL_CODE) {
                this.score_list.splice(this.last_score_index)
                this.fool_count++
            }
        },
        addFool() {
            if (this.FIGHT_NB_FOOL_GIVE_IPPON <= this.fool_count)
                return

            this.fool_count++

            if (this.FIGHT_NB_FOOL_GIVE_IPPON <= this.fool_count)
                this.$emit('on-fool-reached')
        }
    },
    data() {
        return {
            score_list: [],
            fool_count: 0
        }
    }
}
</script>

<template>
    <div class="card score-drag-container" :class="{ 'ripple-out': scoreChoosen && can_put }">
        <draggable
            class="card-body"

            :list="score_list"
            :group="{ name: 'score', pull: false, put: true }"
            :sort="false"
            :disabled="!can_put"
            
            @add="onAdd"
        >
            <span v-for="(score, index) in score_list" :key="index" :title="score.name" class="">
                {{ score.code }}
            </span>
        </draggable>
    </div>
</template>