import buble from 'rollup-plugin-buble'

export default {
  entry: 'index.js',
  dest: 'dist/proteic.js',
  moduleName: 'proteic',
  format: 'umd',
  sourceMap: true,
  plugins: [
    buble()
  ],
   globals: {
        d3: 'd3',
        chai: 'chai',
      },
      external: ['d3', 'chai']
};