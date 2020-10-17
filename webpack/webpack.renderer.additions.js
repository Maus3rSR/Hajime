const path = require('path')

module.exports = {
    resolve: {
        alias: {
            '@src': path.join(__dirname, '../src'),
            '@root': path.join(__dirname, '../src/renderer'),
            '@database': path.join(__dirname, '../src/renderer/database'),
            '@config': path.join(__dirname, '../src/renderer/config'),
            '@lang': path.join(__dirname, '../src/renderer/lang'),
            '@screens': path.join(__dirname, '../src/renderer/screens'),
            '@partials': path.join(__dirname, '../src/renderer/screens/partials'),
            '@themes': path.join(__dirname, '../src/renderer/themes'),
            '@assets': path.join(__dirname, '../src/renderer/assets'),
            '@images': path.join(__dirname, '../src/renderer/assets/img'),
            '@css': path.join(__dirname, '../src/renderer/assets/css'),
            '@scss': path.join(__dirname, '../src/renderer/assets/scss'),
        }
    },
    module: {
        rules: [
            {
                resourceQuery: /blockType=i18n/,
                type: 'javascript/auto',
                loader: '@kazupon/vue-i18n-loader'
            }
        ]
    },
    externals: ["pg", "tedious", "pg-hstore", "mssql"]
}