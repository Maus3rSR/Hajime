import SoftwareContainer from './SoftwareContainer/Component'

// let containerComponentList = []

// const addContainer = component => {
//     containerComponentList.push(component)
// }

// const removeContainer = component => {
//     const index = containerComponentList.findIndex(cmp => cmp == component)
//     if (index != -1)
//         containerComponentList.splice(index, 1)
// }

// const resizeContainer = () => {
//     containerComponentList.forEach(container => container.resize())
// }

const SoftwareContainerPlugin = {
    install(Vue) {
        // Vue.softwareContainer = () => { return { addContainer, removeContainer, resizeContainer} }
        // Vue.prototype.$softwareContainer = Vue.softwareContainer()
        Vue.component("SoftwareContainer", SoftwareContainer)
    }
}

export default SoftwareContainerPlugin