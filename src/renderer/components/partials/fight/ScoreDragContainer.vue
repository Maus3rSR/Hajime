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
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState('configuration', ["FIGHT_NB_FOOL_GIVE_IPPON","FIGHT_FOOL_CODE","FIGHT_SCORE_REACHED_CODE"]),
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
        },
        limit_fool_reached() {
            return this.fool_count > 0 && this.fool_count % this.FIGHT_NB_FOOL_GIVE_IPPON === 0
        },
        is_disabled() {
            return this.disabled || this.limit_score_reached
        }
    },
    methods: {
        onAdd(ev) {
            if (ev.newIndex !== this.last_score_index)
                this.score_list.splice(this.last_score_index, 0, this.score_list.splice(ev.newIndex, 1)[0]);

            const last_item_added = this.score_list.splice(this.last_score_index, 1)[0]

            if (last_item_added.code === this.FIGHT_FOOL_CODE)
                this.addFool()
            else
                this.addScore(last_item_added)
        },
        addScore(score) {
            if (this.is_disabled)
                return

            this.score_list.push(score)

            if (this.limit_score_reached || score.code === this.FIGHT_SCORE_REACHED_CODE)
                this.$emit('on-score-reached')
        },
        addFool() {
            if (this.is_disabled)
                return

            this.fool_count++

            if (this.limit_fool_reached)
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
    <div class="card score-drag-container" :class="{ 'ripple-out': scoreChoosen && !is_disabled }">
        <draggable
            class="card-body"

            :list="score_list"
            :group="{ name: 'score', pull: false, put: true }"
            :sort="false"
            :disabled="is_disabled"
            
            @add="onAdd"
        >
            <span v-for="(score, index) in score_list" :key="index" :title="score.name" class="">
                {{ score.code }}
            </span>

        </draggable>

        <div class="fool-wrapper">
            <span v-for="fool_number in fool_count" :key="fool_number">
                {{ FIGHT_FOOL_CODE }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .score-drag-container {
        position: relative;

        .card-body  {
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            
            > span {
                margin: 15px;
                font-size: 5rem;
                font-weight: bold;
                text-align: center;

                &:first-child {
                    width: 100px;
                    border-radius: 100%;
                    border: #fff solid 2px;
                }
            }
        }

        .fool-wrapper {
            position: absolute;
            display: block;
            bottom: 45px;
            right: 45px;
            font-size: 4rem;
            z-index: 0;

            > span:nth-child(2n) {
                padding-right: 15px;
            }
        }
    }
</style>