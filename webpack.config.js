var webpack = require('webpack');
var path = require('path');

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: './index.ts',
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
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: []
}
