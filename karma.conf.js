var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*.ts'
    ],
    exclude: [
    ],
    preprocessors: {
      'src/**/!(defaults)/*.js': ['coverage'],
      'test/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['ChromeES6'],
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      includeAllSources: true,
      reporters: [
        // generates ./coverage/lcov.info
        { type: 'lcovonly', subdir: '.' },
        // generates ./coverage/coverage-final.json
        { type: 'json', subdir: '.' },
        // generates HTML reports
        { type: 'html', dir: 'coverage/' }
      ]
    },
    customLaunchers: {
      ChromeES6: {
        base: 'Chrome',
        flags: ['--javascript-harmony', '--no-sandbox']
      }
    }
  })
}