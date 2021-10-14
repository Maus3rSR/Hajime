<script setup lang="ts">
import type { ChildComponent } from 'vue'
import type { FeedbackType as FeedbackTypeEnum } from '/composables/feedback'
import { ref, computed, provide } from 'vue'
import { useFeedback } from '/composables/feedback'
import * as formComponents from './form'

type FeedbackFormArray = Array<FeedbackFormComponent>
interface FeedbackFormComponent {
    name: string
    type: FeedbackTypeEnum
    component: ChildComponent
}

const // Initialization
    { FeedbackType, currentFeedbackType, onSubmit, schema } = useFeedback(),
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
    modal = ref<ChildComponent>(),
    // Computed
    feedbackForm = computed(() =>
        feedbackForms.find(form => form.type === currentFeedbackType.value)
    ),
    // Methods
    changeForm = (form: FeedbackFormComponent) => {
        currentFeedbackType.value = form.type
    },
    tabChanged = (selectedTab: Record<string, any>) => {
        const { hash } = selectedTab.tab,
            form = feedbackForms.find(
                form => `#${form.name.toLowerCase()}` === hash
            )

        if (!form) return

        changeForm(form)
    }

provide('schema', schema)
provide('onSubmit', onSubmit)
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
        @submit="() => {}"
        @cancel="() => {}"
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
