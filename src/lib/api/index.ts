import type { Ref } from 'vue'
import type { UseFetchOptions, UseFetchReturn } from '@vueuse/core'
import { createFetch } from '@vueuse/core'

enum METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}
type ApiResponse<T> = UseFetchReturn<T>

interface Api {
    get<T>(path: string): ApiResponse<T>,
    post<T>(path: string, data: BodyInit): ApiResponse<T>,
    put<T>(path: string, data: BodyInit): ApiResponse<T>,
    delete<T>(path: string): ApiResponse<T>
}

const fetchOptions: RequestInit = {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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
            return useFetch<T>(path).get()
        },
        post: <T>(path: string, data: BodyInit) => {
            return useFetch<T>(path).post(data)
        },
        put: <T>(path: string, data: BodyInit) => {
            return useFetch<T>(path).post(data)
        },
        delete: <T>(path: string) => {
            return useFetch<T>(path).delete()
        }
    }
}