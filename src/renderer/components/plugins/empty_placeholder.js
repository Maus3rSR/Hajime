import EmptyPlaceholder from './EmptyPlaceholder/Component'

const EmptyPlaceholderPlugin = {
    install(Vue) {
        Vue.component("EmptyPlaceholder", EmptyPlaceholder)
    }
}

export default EmptyPlaceholderPlugin;