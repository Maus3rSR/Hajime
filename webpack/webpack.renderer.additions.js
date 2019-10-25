const path = require('path')

module.exports = {
    resolve: {
        alias: {
            '@src': path.join(__dirname, '../src'),
            '@root': path.join(__dirname, '../src/renderer'),
            '@database': path.join(__dirname, '../src/renderer/database'),
            '@components': path.join(__dirname, '../src/renderer/components'),
            '@partials': path.join(__dirname, '../src/renderer/components/partials'),
            '@themes': path.join(__dirname, '../src/renderer/themes'),
            '@assets': path.join(__dirname, '../src/renderer/assets'),
            '@images': path.join(__dirname, '../src/renderer/assets/img'),
            '@styles': path.join(__dirname, '../src/renderer/assets/scss'),
        }
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'file-loader'
            }
        ]
    },
    externals: ["pg", "tedious", "pg-hstore", "mssql"]
}