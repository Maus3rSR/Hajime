<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import EntryList from '@partials/list/entry_list/Component'

export default {
    components: { EntryList },
    computed: {
        ...mapState('competition', {
            competition_type: state => state.model.type,
            is_fighter_list_lock: state => state.model.locked_entry_list
        }),
        ...mapState('configuration', ["COMPETITION_MINIMUM_ENTRANT"]),
        ...mapGetters({
            entry_present_count: "competition/entry_present_count",
            competition_saving: "competition/saving",
        }),
        ...mapFields('competition', {
            entry_list: 'model.entry_list',
            locked_entry_list: 'model.locked_entry_list'
        }),
        step_is_valid() {
            return this.entry_present_count >= this.COMPETITION_MINIMUM_ENTRANT
        },
    },
    methods: {
        ...mapActions({
            saveCompetition: "competition/SAVE",
            bulkUpdateEntry: "competition/BULK_UPDATE_ENTRY",
            saveFighter: "competition/SAVE_FIGHTER",
            deleteFighter: "competition/DELETE_FIGHTER"
        }),
        save() {
            if (this.competition_saving) return

            this.locked_entry_list = true
            this.saveCompetition()
                .then(() => this.$emit('onValidate'))
                .catch(() => this.locked_entry_list = false)
        },
        confirm() {
            this.$refs.modalConfirmCall.show()
        },
        process() {
            if (this.competition_saving) return

            if (this.is_fighter_list_lock) {
                this.$emit('onValidate')
                return
            }

            this.confirm()
        }
    }
}
</script>

<i18n src="@lang/generic/common.json"></i18n>
<i18n src="@lang/screens/software/competition/manage.json"></i18n>

<template>
    <div>
        <div class="row">
            <div class="col-sm-12">
                <transition name="fade" type="out-in" appear>
                    <entry-list
                        v-model="entry_list"

                        :competition_type="competition_type"
                        :make_the_call="true"
                        :readonly="is_fighter_list_lock"
                        :emit_change="true"
                        :can_import="false"

                        @on-fighter-add="saveFighter"
                        @on-fighter-edit="saveFighter"
                        @on-fighter-delete="deleteFighter"
                        @on-bulk-update="bulkUpdateEntry"
                    />
                </transition>
            </div>
        </div>

        <div class="row software__container--offset-element">
            <div class="col">
                <transition name="fade" type="out-in" appear>
                    <span class="text-warning" v-if="!step_is_valid">
                        <i class="zmdi zmdi-alert-triangle"></i>
                        {{ $t("competition-manage.not-enough") }}
                    </span>
                </transition>
            </div>
            <div class="col">
                <button :disabled="!step_is_valid" :class="{'btn-outline-success tada': step_is_valid}" class="btn float-right animated" @click="process">
                    {{ $t("common.action.step-next") }}
                    <transition name="fade" mode="out-in">
                        <i v-if="!competition_saving" class="zmdi zmdi-arrow-right"></i>
                        <clip-loader v-else :size="'14px'"></clip-loader>
                    </transition>
                </button>
            </div>
        </div>

        <modal-confirmation
            ref="modalConfirmCall"
            :title="$t('competition-manage.confirm-call.title')"

            @on-confirm="save"
        >
            <template slot="label">
                {{ $t("competition-manage.confirm-call.label") }}
            </template>

            <template slot="content">
                {{ $t("competition-manage.confirm-call.content") }}
            </template>
        </modal-confirmation>
    </div>
</template>
