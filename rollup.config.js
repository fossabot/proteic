import typescript from 'rollup-plugin-typescript';

export default {
  entry: 'index.ts',
  dest: 'build/proteic.js',
  moduleName: 'proteic',
  format: 'umd',
  sourceMap: true,
  plugins: [
    typescript()
  ],
  globals: {
    'd3-scale': 'd3-scale',
    'd3-format': 'd3-format',
    'd3-axis': 'd3-axis',
    'd3-select': 'd3-select',
    chai: 'chai',
  },
  external: [
    'd3-scale',
    'd3-format',
    'd3-axis',
    'd3-select',
    'chai'
  ]
};