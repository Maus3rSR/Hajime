import FighterList from './FighterList/Component'

const FighterListPlugin = {
    install(Vue) {
        Vue.component("FighterList", FighterList)
    }
}

export default FighterListPlugin;