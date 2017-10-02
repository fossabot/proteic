var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: {
        js: ['./src/core.ts', './index.ts'],
        css: './scss/themes/default/proteic.scss'
    },
    id: 'proteic',
    output: {
        filename: 'dist/proteic.js',
        library: 'proteic'
    },
    externals:{
        xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
    },
    devServer: {
        contentBase: path.join(__dirname, '.'),
        inline: true
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js', '.scss']
    },
    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'tslint' }
        ],

        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "css!sass")
            },
            { 
                test: /\.svg$/, 
                loader: 'svg-inline-loader' 
            },
        ],
        tslint: {
            typeCheck: true,
            failOnHint: true,
            emitErrors: true,
            configuration: require('./tslint.json')
        }
    },
    plugins: [
        new ExtractTextPlugin("./dist/proteic.css")

    ]
}