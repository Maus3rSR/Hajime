import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
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

export type { Feedback }
export function useFeedback() {

    const // Refs
        currentFeedbackType = ref<FeedbackType>(FeedbackType.BUG),
        // Computed
        form = computed(() => getForm(currentFeedbackType)),
        // Composables
        { errors, handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema: form.schema }),
        // Methods
        switchFeedbackType = (type: FeedbackType) => currentFeedbackType.value = type,
        onSubmit = handleSubmit(values => {
            console.log(values, form)
        })

    return {
        FeedbackType,
        onSubmit,
        isSubmitting,
        resetForm,
        form,
        errors,
        switchFeedbackType,
    }
}