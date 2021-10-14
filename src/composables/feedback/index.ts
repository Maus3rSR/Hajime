import { ref, shallowReactive, computed, watch } from 'vue'
import type { FormActions } from 'vee-validate'
import type { Feedback } from './types'
import { FeedbackType, FeedbackFormClassic, FeedbackFormBug } from './types'

const getForm = (type: FeedbackType) => {
    switch (type) {
        case FeedbackType.BUG:
            return new FeedbackFormBug()
        default:
            return new FeedbackFormClassic()
    }
}

export type { Feedback, FeedbackType }
export function useFeedback() {

    let data = shallowReactive({ form: {} })

    const // Refs
        currentFeedbackType = ref<FeedbackType>(FeedbackType.BUG),
        // Computed
        schema = computed(() => data.form.schema),
        // Composables
        onSubmit = (feedback: Feedback, formActions: FormActions) => {
            const { resetForm } = formActions
            data.form.feedback = feedback
            resetForm()
        }

    watch(currentFeedbackType, (type: FeedbackType) => {
        data.form = getForm(type)
    }, { immediate: true })

    return {
        FeedbackType,
        currentFeedbackType,
        schema,
        onSubmit,
    }
}