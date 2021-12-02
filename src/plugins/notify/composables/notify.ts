import { inject } from 'vue'
import type { ContentObject, ToastOptions } from 'mosha-vue-toastify/dist/types'
import { createToast } from 'mosha-vue-toastify'

enum ToastType {
    DEFAULT = 'default',
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    DANGER = 'danger'
}

type NotifierFunction = (content: ContentObject, overrideOptions?: NotifierOptions) => void
type NotifierOptions = Pick<ToastOptions, "timeout" | "showCloseButton" | "hideProgressBar" | "swipeClose" | "onClose">

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
        info = (content: ContentObject, overrideOptions?: NotifierOptions) => {
            createToast(content, {
                type: ToastType.INFO,
                ...defaultOptions,
                ...overrideOptions
            })
        },
        success = (content: ContentObject, overrideOptions?: NotifierOptions) => {
            createToast(content, {
                type: ToastType.SUCCESS,
                ...defaultOptions,
                ...overrideOptions
            })
        },
        warning = (content: ContentObject, overrideOptions?: NotifierOptions) => {
            createToast(content, {
                type: ToastType.WARNING,
                ...defaultOptions,
                ...overrideOptions
            })
        },
        error = (content: ContentObject, overrideOptions?: NotifierOptions) => {
            createToast(content, {
                type: ToastType.DANGER,
                timeout: 10000,
                ...defaultOptions,
                ...overrideOptions
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