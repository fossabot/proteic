var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    watch: false,
    entry: './index.ts',
    id: 'proteic',
    output: {
        filename: 'dist/proteic.js',
        library: 'proteic'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}
