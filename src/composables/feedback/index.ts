import { ref, reactive, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import type { Feedback, Schema } from './types'
import { FeedbackType, FeedbackFormClassic, FeedbackFormBug } from './types'

type Fields = Record<string, any>

let submit = () => {},
    reset = () => {}

const getForm = (type: FeedbackType) => {
    switch (type) {
        case FeedbackType.BUG:
            return new FeedbackFormBug()
        default:
            return new FeedbackFormClassic()
    }
}

function useFeedback(type: FeedbackType) {

    const // Initialization
        form = getForm(type),
        fields: Fields = {},
        // Computed
        schema = computed(() => form.schema),
        // Composables
        { handleSubmit, resetForm, errors } = useForm({ validationSchema: schema })

    submit = handleSubmit((feedback: Feedback) => {
        form.feedback = feedback
    })

    reset = resetForm

    Object.keys(schema.value).forEach(fieldName => {
        const { value } = useField(fieldName)
        fields[fieldName] = value
    })

    return {
        schema,
        fields,
        errors,
        submit,
        reset
    }
}

export type { Schema, Fields, Feedback, FeedbackType as FeedbackTypeDefinition }
export { FeedbackType, useFeedback, submit, reset }