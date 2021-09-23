import { inject } from 'vue'

export function useFormData() {
    const // Inject
        fields = inject('fields'),
        errors = inject('errors')

    return { fields, errors }
}