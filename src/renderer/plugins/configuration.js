import Store from 'electron-store'

const configuration = new Store()

const ConfigurationPlugin = {
    install(Vue) { Vue.configuration = Vue.prototype.$configuration = configuration }
}

export default ConfigurationPlugin