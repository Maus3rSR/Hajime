import { ref, computed, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import router from '@/config/router'
import { N8N_FEEDBACK_PATH } from '@/config/env'
import { useNotify } from '@/plugins/notify'
import { useN8N } from '@api/n8n'
import type { Feedback, Schema } from './types'
import { FeedbackType, FeedbackResponse, FeedbackFormClassic, FeedbackFormBug } from './types'

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
        { success: notifySuccess, error: notifyError } = useNotify(),
        { isSubmitting, errors, meta, handleSubmit, resetForm } = useForm({ validationSchema: schema })

    globalReset = resetForm
    globalSubmit = handleSubmit(values => {
        form.feedback = values as Feedback
        form.feedback.version = __APP_VERSION__
        form.feedback.screen = router.currentRoute.value.name as string
        form.feedback.os = navigator.userAgent // TODO: software adaptation / rename OS key to user agent?

        console.log(values)

        return new Promise((resolve, reject) => {
            resolve(true)
            return

            const { post } = useN8N(N8N_FEEDBACK_PATH),
                { error, data,  onFetchResponse, onFetchError } = post<FeedbackResponse>(form.toJson())
                
            onFetchResponse(() => {

                if (!!error.value || !data.value || !!data.value && !data.value.success) {

                    notifyError({
                        title: "Erreur",
                        description: "Une erreur est survenue",
                    })

                    reject()
                    return
                }

                notifySuccess({
                    title: "Super !",
                    description: `
Le feedback a bien été envoyé, nous vous remercions ! 💖
Vous pouvez suivre l'évolution de votre retour :
<a class="btn btn-link btn-xs" href="${data.value.issue_url}" target="_blank">Ouvrir le ticket</a>.
                    `,
                }, {
                    timeout: -1,
                    showCloseButton: true
                })

                resolve(null)
            })
                
            onFetchError(() => {
                notifyError({
                    title: "Erreur",
                    description: error.value as string,
                })

                reject()
            })
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