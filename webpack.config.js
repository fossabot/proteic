module.exports = {
    watch: false,
    entry: './index.ts',
    output: {
        filename: 'dist/proteic.js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
}