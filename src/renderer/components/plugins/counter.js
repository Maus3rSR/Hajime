import Counter from './Counter/Component'

const CounterPlugin = {
    install(Vue) {
        Vue.component("Counter", Counter)
    }
}

export default CounterPlugin