var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: {
        js: ['./src/core.ts', './index.ts'],
        css: './scss/proteic.scss'
    },
    id: 'proteic',
    output: {
        filename: 'dist/proteic.js',
        library: 'proteic'
    },
    devServer: {
        contentBase: path.join(__dirname, '.'),
        inline: true
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css!sass")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("./dist/proteic.css")

    ]
}
