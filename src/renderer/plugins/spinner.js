import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import GridLoader from 'vue-spinner/src/GridLoader.vue'
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import RotateLoader from 'vue-spinner/src/RotateLoader.vue'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue'
import SquareLoader from 'vue-spinner/src/SquareLoader.vue'
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
import SkewLoader from 'vue-spinner/src/SkewLoader.vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import RingLoader from 'vue-spinner/src/RingLoader.vue'
import BounceLoader from 'vue-spinner/src/BounceLoader.vue'
import DotLoader from 'vue-spinner/src/DotLoader.vue'

const VueSpinner = {
  PulseLoader,
  GridLoader,
  ClipLoader,
  RiseLoader,
  BeatLoader,
  SyncLoader,
  RotateLoader,
  FadeLoader,
  PacmanLoader,
  SquareLoader,
  ScaleLoader,
  SkewLoader,
  MoonLoader,
  RingLoader,
  BounceLoader,
  DotLoader
}

const SpinnerPlugin = {
    install(Vue) {
        Object.keys(VueSpinner).forEach(componentName => Vue.component(componentName, VueSpinner[componentName]))
    }
}

export default SpinnerPlugin;