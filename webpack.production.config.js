var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: ['./src/core.ts', './index.ts'],
    id: 'proteic',
    output: {
        filename: 'dist/proteic.js',
        library: 'proteic',
        libraryTarget: 'umd'
    },
    externals:{
        xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' },
        ],
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap : true
        })

    ]
}
