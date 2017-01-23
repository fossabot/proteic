<<<<<<< HEAD
// Karma configuration
// Generated on Wed Apr 06 2016 14:18:09 GMT+0200 (CEST)
=======
>>>>>>> webpack
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
<<<<<<< HEAD
      'test/**/*.ts': ['webpack']
    },

=======
      'src/**/!(defaults)/*.js': ['coverage'],
      'test/**/*.ts': ['webpack']
    },
>>>>>>> webpack
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
<<<<<<< HEAD
    reporters: ['progress'],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'progress',
      // Output code coverage files
      'coverage'
    ],

=======
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
>>>>>>> webpack
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
<<<<<<< HEAD

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    customLaunchers: {
      ChromeES6: {
        base: 'Chrome',
        flags: ['--javascript-harmony', '--no-sandbox']
      }
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeES6'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  });
};
=======
  })
}
>>>>>>> webpack
