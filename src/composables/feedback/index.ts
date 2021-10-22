import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import type { Feedback, Schema } from './types'
import { FeedbackType, FeedbackFormClassic, FeedbackFormBug } from './types'

type Fields = Record<string, any>

let globalSubmit = () => {},
    globalReset = () => {}

const // Refs
    submitting = ref<boolean>(false),
    validated = ref<boolean>(false),
    // Methods
    getForm = (type: FeedbackType) => {
        switch (type) {
            case FeedbackType.BUG:
                return new FeedbackFormBug()
            default:
                return new FeedbackFormClassic()
        }
    }

function useGlobalFeedback() {

    const submit = () => globalSubmit()
    const reset = () => globalReset()

    return { submitting, validated, submit, reset }
}

function useFeedback(type: FeedbackType) {

    const // Initialization
        form = getForm(type),
        fields: Fields = {},
        // Computed
        schema = computed(() => form.schema),
        // Composables
        { isSubmitting, errors, meta, handleSubmit, resetForm } = useForm({ validationSchema: schema })

    globalReset = resetForm
    globalSubmit = handleSubmit(values => {
        form.feedback = values as Feedback
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true)
            }, 1000)
        })
    })

    Object.keys(schema.value).forEach(fieldName => {
        const { value } = useField(fieldName)
        fields[fieldName] = value
    })

    watch(() => meta.value.valid, value => validated.value = value)
    watch(isSubmitting, value => submitting.value = value)

    return {
        schema,
        fields,
        errors,
        submitting: isSubmitting,
        submit: globalSubmit,
        reset: globalReset
    }
}

export type { Schema, Fields, Feedback, FeedbackType as FeedbackTypeDefinition }
export { FeedbackType, useFeedback, useGlobalFeedback }