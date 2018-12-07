import FighterImport from './FighterImport/Component'

const FighterImportPlugin = {
    install(Vue) {
        Vue.component("FighterImport", FighterImport)
    }
}

export default FighterImportPlugin;