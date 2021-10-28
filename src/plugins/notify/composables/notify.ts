import { inject } from 'vue'
import type { ContentObject, ToastOptions } from 'mosha-vue-toastify/dist/types'
import { createToast } from 'mosha-vue-toastify'

type NotifierFunction = (content: ContentObject) => void

enum ToastType {
    DEFAULT = 'default',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger'
}

interface Notifier {
    info: NotifierFunction,
    success: NotifierFunction,
    warning: NotifierFunction,
    error: NotifierFunction,
    danger: NotifierFunction,
}

const defaultOptions: ToastOptions = {
    position: 'bottom-center',
    transition: 'slide',
    showIcon: true
}

export function createNotify(): Notifier {
    const // Api
        info = (content: ContentObject) => {
            createToast(content, {
                type: ToastType.INFO,
                ...defaultOptions
            })
        },
        success = (content: ContentObject) => {
            createToast(content, {
                type: ToastType.SUCCESS,
                ...defaultOptions
            })
        },
        warning = (content: ContentObject) => {
            createToast(content, {
                type: ToastType.WARNING,
                ...defaultOptions
            })
        },
        error = (content: ContentObject) => {
            createToast(content, {
                type: ToastType.DANGER,
                timeout: 10000,
                ...defaultOptions
            })
        },
        danger = error // alias

    return { info, success, warning, error, danger }
}

export function useNotify(): Notifier {
    const notify: Notifier | undefined = inject('notify')
    if (!notify) throw new Error('notify was not provided')

    return notify
}