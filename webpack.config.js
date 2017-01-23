var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    watch: false,

    entry: './index.ts',
    output: {
        filename: 'dist/proteic.js',
        libraryTarget: 'umd'

    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '']
    },

    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
};
