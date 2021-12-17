<script setup lang="ts">
import type { Component } from 'vue'
import { ref, shallowRef } from 'vue'
import type { ModalFormComponent } from '@/plugins/modal'
import type { FeedbackType as FeedbackTypeDefinition } from '@/composables/feedback'
import { FeedbackType, useGlobalFeedback } from '@/composables/feedback'
import * as formComponents from './form'

type FeedbackFormArray = Array<FeedbackFormComponent>

interface FeedbackFormComponent {
    name: string
    type: FeedbackTypeDefinition
    component: Component
}

const // Initialization
    /**
     * @TODO handle default tab
     */
    feedbackForms: FeedbackFormArray = [
        {
            name: 'Bug',
            type: FeedbackType.BUG,
            component: formComponents.BugForm,
        },
        {
            name: 'Suggestion',
            type: FeedbackType.CLASSIC,
            component: formComponents.ClassicForm,
        },
    ],
    // Refs
    modal = ref<ModalFormComponent>(),
    feedbackForm = shallowRef<FeedbackFormComponent>(feedbackForms[0]),
    // Composables
    { submitting, validated, submit, reset } = useGlobalFeedback(),
    // Methods
    tabChanged = (selectedTab: Record<string, any>) => {
        const { hash } = selectedTab.tab,
            form = feedbackForms.find(
                form => `#${form.name.toLowerCase()}` === hash
            )

        if (!form) return

        feedbackForm.value = form
    },
    submitForm = async () => {
        try {
            await submit()
            reset()
            modal.value?.close()
        } catch (e) {}
    },
    cancelForm = () => reset() // Do not use directly onto event, it won't work
</script>


<template>
    <button
        v-bind="$attrs"
        class="btn btn-xs btn-primary"
        @click="modal?.show()"
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
        @submit="submitForm"
        @cancel="cancelForm"
        :submitting="submitting"
        :disabled="!validated"
    >
        <div class="flex items-center flex-col">
            <Tabs @changed="tabChanged">
                <Tab
                    v-for="form in feedbackForms"
                    :key="form.type"
                    :title="form.name"
                ></Tab>
            </Tabs>
        </div>

        <component :is="feedbackForm.component"></component>

        <template #title>Feedback</template>
    </ModalForm>
</template>
