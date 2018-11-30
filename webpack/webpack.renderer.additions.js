const path = require('path')

module.exports = {
    resolve: {
        alias: {
            '@themes': path.join(__dirname, '../src/renderer/themes'),
            '@assets': path.join(__dirname, '../src/renderer/assets'),
            '@images': path.join(__dirname, '../src/renderer/assets/img'),
            '@styles': path.join(__dirname, '../src/renderer/assets/scss'),
        }
    },
    module: {
        rules: []
    }
}