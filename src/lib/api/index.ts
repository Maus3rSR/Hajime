import type { Ref } from 'vue'
import type { UseFetchOptions } from 'vue-composable'
import { useFetch } from 'vue-composable'

enum METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

type ApiResponse = Promise<Response | undefined>

interface Api<T> {
    get(path: string): ApiResponse,
    post(path: string, data: BodyInit): ApiResponse,
    put(path: string, data: BodyInit): ApiResponse,
    delete(path: string): ApiResponse
    readonly loading: Ref<boolean>
    readonly result: Ref<T>,
    readonly error: Ref<any>
}

const fetchOptions: RequestInit & UseFetchOptions = {
    isJson: true,
    parseImmediate: true,
    unmountCancel: true,
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
export function useApi<T>(baseUrl: string): Api<T> {

    const { json, error, loading, exec } = useFetch(fetchOptions),
        getUrl = (path: string) => baseUrl + path

    return {
        get: async (path: string) => {
            return exec(getUrl(path))
        },
        post: async (path: string, data: BodyInit) => {
            console.log(baseUrl, path, data)
            return exec(getUrl(path), {
                body: data,
                method: METHOD.POST
            })
        },
        put: async (path: string, data: BodyInit) => {
            return exec(getUrl(path), {
                body: data,
                method: METHOD.PUT,
            })
        },
        delete: async (path: string) => {
            return exec(getUrl(path))
        },
        loading,
        result: json,
        error
    }
}