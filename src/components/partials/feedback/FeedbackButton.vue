<script setup lang="ts">
import type { ChildComponent } from 'vue'
import { ref } from 'vue'
import { useFeedback } from '/composables/feedback'

const // Initialization
    { FeedbackType, onSubmit, isSubmitting, resetForm, form, errors, switchFeedbackType } = useFeedback(),
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

    <ModalForm class="modal-xxl" ref="modal" @submit="onSubmit">
        {{ isSubmitting }}
        <div class="grid grid-cols-2 gap-4">
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">Email if you want to be notified</span>
                </label>
                <input
                    type="text"
                    class="input input-bordered input-sm"
                    v-model="form.email"
                >
                <span>{{ errors.email }}</span>
            </div>

            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">Describe the bug <span class="text-error">*</span></span>
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    v-model="form.description"
                ></textarea>
                <span>{{ errors.description }}</span>
            </div>

            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text">Steps to reproduce the behavior <span class="text-error">*</span></span>
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    v-model="form.reproduce"
                ></textarea>
                <span>{{ errors.reproduce }}</span>
            </div>

            <div class="form-control col-span-2 sm:col-auto">
                <label class="label">
                    <span class="label-text">Expected behavior <span class="text-error">*</span></span>
                </label>
                <textarea
                    type="text"
                    class="textarea textarea-bordered textarea-sm"
                    v-model="form.expected"
                ></textarea>
                <span>{{ errors.expected }}</span>
            </div>
            
            <div class="form-control col-span-2">
                <label class="label">
                    <span class="label-text">Screenshot</span>
                </label>
                <input type="file" class="input input-bordered input-sm">
            </div>
        </div>

        <template #title>Feedback</template>
    </ModalForm>
</template>
