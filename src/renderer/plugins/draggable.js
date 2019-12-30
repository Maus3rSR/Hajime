import draggable from 'vuedraggable'

const DraggablePlugin = {
    install(Vue) {
        Vue.component("draggable", draggable)
    }
}

export default DraggablePlugin