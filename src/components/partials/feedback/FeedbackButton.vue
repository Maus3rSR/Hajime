<script setup lang="ts">
import type { ChildComponent } from 'vue'
import { ref } from 'vue'
import { useFeedback } from '/composables/feedback'

const // Initialization
    {
        FeedbackType,
        onSubmit,
        isSubmitting,
        resetForm,
        fields,
        errors,
        switchFeedbackType,
    } = useFeedback(),
    // Refs
    modal = ref<ChildComponent>()
</script>


<template>
    <button
        v-bind="$attrs"
        class="btn btn-xs btn-primary"
        @click="modal.show()"
    >
        <FontAwesomeIcon
            :icon="['far', 'handshake']"
            class="mr-1"
        ></FontAwesomeIcon>
        Feedback
    </button>

    <ModalForm
        class="modal-xxl"
        ref="modal"
        @submit="onSubmit"
        @cancel="resetForm"
    >
        <div class="flex items-center flex-col">
            <Tabs>
                <Tab title="Test"></Tab>
                <Tab title="Test long texte bordel"></Tab>
                <Tab title="Test moyen"></Tab>
            </Tabs>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text"
                        >Describe the bug
                        <span class="text-error">*</span></span
                    >
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="description"
                    v-model="fields.description.value"
                ></textarea>
                <span
                    v-if="errors.description"
                    class="alert alert-error mt-2"
                    >{{ errors.description }}</span
                >
            </div>

            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text"
                        >Steps to reproduce the behavior
                        <span class="text-error">*</span></span
                    >
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="reproduce"
                    v-model="fields.reproduce.value"
                ></textarea>
                <span v-if="errors.reproduce" class="alert alert-error mt-2">{{
                    errors.reproduce
                }}</span>
            </div>

            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text"
                        >Expected behavior
                        <span class="text-error">*</span></span
                    >
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    name="expected"
                    v-model="fields.expected.value"
                ></textarea>
                <span v-if="errors.expected" class="alert alert-error mt-2">{{
                    errors.expected
                }}</span>
            </div>

            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text"
                        >Email <i>(if you want to be notified)</i></span
                    >
                </label>
                <input
                    type="email"
                    class="input input-bordered input-sm"
                    name="email"
                    v-model="fields.email.value"
                />
                <span v-if="errors.email" class="alert alert-error mt-2">{{
                    errors.email
                }}</span>
            </div>

            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">Screenshot</span>
                </label>
                <input
                    type="file"
                    name="screenshot"
                    class="input input-bordered input-sm"
                />
            </div>
        </div>

        <template #title>Feedback</template>
    </ModalForm>
</template>
