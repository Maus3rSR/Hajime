import { ref, reactive, computed, watchEffect } from 'vue'
import { useForm, useField } from 'vee-validate'
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

    let data = reactive({ form: {} })
    let fields: Record<string, any> = {}

    const // Refs
        currentFeedbackType = ref<FeedbackType>(FeedbackType.BUG),
        // Computed
        schema = computed(() => data.form.schema),
        // Composables
        { errors, handleSubmit, isSubmitting, resetForm } = useForm({ validationSchema: schema }),
        // Methods
        switchFeedbackType = (type: FeedbackType) => currentFeedbackType.value = type,
        updateFields = () => {
            fields = {}
            Object.keys(data.form.schema).forEach(fieldName => {
                const { value } = useField(fieldName)
                fields[fieldName] = value
            })
        },
        onSubmit = handleSubmit((feedback: Feedback) => {
            data.form.feedback = feedback
        })

    watchEffect(() => {
        data.form = getForm(currentFeedbackType.value)
        updateFields()
    })

    return {
        FeedbackType,
        onSubmit,
        isSubmitting,
        resetForm,
        fields,
        errors,
        switchFeedbackType,
    }
}