import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import { createFetch } from '@vueuse/core'

interface Api {
    get<T>(path: string): UseFetchReturn<T>,
    post<T>(path: string, data: BodyInit): UseFetchReturn<T>,
    put<T>(path: string, data: BodyInit): UseFetchReturn<T>,
    delete<T>(path: string): UseFetchReturn<T>
}

const fetchOptions: RequestInit = {
    headers: {
        'Accept': 'application/json',
    }
}

/**
 * @todo Handle credentials and additional headers
 * @param baseUrl
 * @return Api
 */
export function createApi(baseUrl: string, options: UseFetchOptions = {}): Api {

    const useFetch = createFetch({
        baseUrl,
        fetchOptions,
        options
    })

    return {
        get: <T>(path: string) => {
            return useFetch<T>(path).get().json()
        },
        post: <T>(path: string, data: BodyInit) => {
            return useFetch<T>(path).post(data).formData().json()
        },
        put: <T>(path: string, data: BodyInit) => {
            return useFetch<T>(path).post(data).formData().json()
        },
        delete: <T>(path: string) => {
            return useFetch<T>(path).delete().json()
        }
    }
}