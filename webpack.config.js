var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: {
        js: ['./index.ts'],
        css: './scss/themes/default/proteic.scss'
    },
    output: {
        library: 'proteic',
        filename: 'dist/[name].js',
    },
    devServer: {
        contentBase: path.join(__dirname, '.'),
        inline: true
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.js', '.scss'],
    },
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    typeCheck: true,
                    failOnHint: true,
                    emitErrors: true,
                    configuration: require('./tslint.json')
                }
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            }
        ],
    },
}