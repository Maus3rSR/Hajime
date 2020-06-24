import path from 'path'
import * as url from 'url'

const isDevelopment = process.env.NODE_ENV !== 'production'

export function getStatic(val) { // see https://github.com/electron-userland/electron-webpack/issues/99#issuecomment-459251702
    return isDevelopment
        ? url.resolve(window.location.origin, val)
        : path.resolve(__static, val)
}