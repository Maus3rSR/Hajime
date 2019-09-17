const path = require('path')
// const webpack = require('webpack')
// const nodeExternals = require('webpack-node-externals')

module.exports = {
    resolve: {
        alias: {
            '@src': path.join(__dirname, '../src'),
            '@root': path.join(__dirname, '../src/renderer'),
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
    // plugins: [
    //     new webpack.ContextReplacementPlugin(/Sequelize(\\|\/)/, path.resolve(__dirname, '../src'))
    // ],
    // externals: [nodeExternals({
    //     modulesFromFile: {
    //         exclude: [/* sections to exclude, i.e 'devDependencies' */],
    //         include: ['devDependencies']
    //     }
    // })]
    // externals: ["pg", "tedious", "pg-hstore", "mssql"]
    externals: ["sequelize"]
}