import { createApi } from '@api/index'
import { N8N_URL } from '@/config/env'

const api = createApi(N8N_URL)

export function useN8N(workflowName: string) {
    return {
        get: <T>() => {
            return api.get<T>(workflowName)
        },
        post: <T>(data: BodyInit) => {
            return api.post<T>(workflowName, data)
        }
    }
}