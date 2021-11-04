import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { useNotify } from '@/plugins/notify'
import { N8N_URL, N8N_FEEDBACK_PATH } from '@/config/env'
import { useApi } from '@api/index'
import type { Feedback, Schema } from './types'
import { FeedbackType, FeedbackFormClassic, FeedbackFormBug } from './types'

type Fields = Record<string, any>

interface N8nResponse { issue_url: string }

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
        { success: notifySuccess, error: notifyError } = useNotify(),
        { isSubmitting, errors, meta, handleSubmit, resetForm } = useForm({ validationSchema: schema })

    globalReset = resetForm
    globalSubmit = handleSubmit(values => {
        form.feedback = values as Feedback
        form.feedback.version = __APP_VERSION__

        const { result, error, post } = useApi<N8nResponse>(N8N_URL)

        try {
            post(N8N_FEEDBACK_PATH, form.toJson())
                .then(() => console.log('OK !'))
                .catch(() => "NOT OK !")

            console.log(result.value)
            console.log(error.value)

            notifySuccess({
                title: "Super !",
                description: "Le feedback a bien été envoyé, bisous",
            })
        } catch (error) {
            notifyError({
                title: "Problème...",
                description: error as string,
            })
        }
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