import SoftwareContainer from './SoftwareContainer/Component'

const SoftwareContainerPlugin = {
    install(Vue) {
        Vue.component("SoftwareContainer", SoftwareContainer)
    }
}

export default SoftwareContainerPlugin