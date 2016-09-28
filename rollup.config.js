import buble from 'rollup-plugin-buble'

export default {
  entry: 'index.js',
  dest: 'build/bundle.min.js',
  moduleName: 'Proteus',
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