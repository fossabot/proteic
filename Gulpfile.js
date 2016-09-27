/* jshint node: true */
'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const server = require('karma').Server;
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');
const protractor = require("gulp-protractor").protractor;
const webdriver_update = require('gulp-protractor').webdriver_update;
const webdriver_standalone = require('gulp-protractor').webdriver_standalone;
const webserver = require('gulp-webserver');
const shell = require('gulp-shell');
const jsinspect = require('gulp-jsinspect');
const jsdoc = require('gulp-jsdoc3');
const watch = require('gulp-watch');
const rollup = require('rollup');
const sourcemaps = require('gulp-sourcemaps');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const libname = 'proteus-charts';

gulp.task('syntax', () => {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('babel', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('concat', ['babel'], () => {
  return gulp.src([
    './lib/utils/functions.js',
    './lib/utils/image.js',
    './lib/utils/strategies.js',
    './lib/utils/colors.js',
    './lib/utils/defaults/*.js',
    './lib/utils/ProteusEvent.js',
    './lib/datasources/Datasource.js',
    './lib/datasources/WebsocketDatasource.js',
    './lib/svg/SvgStrategy.js',
    './lib/svg/svg.js',
    './lib/svg/strategy_barchart.js',
    './lib/svg/strategy_linechart.js',
    './lib/svg/strategy_streamgraph.js',
    './lib/svg/strategy_gauge.js',
    './lib/svg/strategy_sunburst.js',
    './lib/charts/base/Chart.js',
    './lib/charts/barchart.js',
    './lib/charts/linechart.js',
    './lib/charts/streamgraph.js',
    './lib/charts/gauge.js',
    './lib/charts/sunburst.js',
    './lib/utils/factory.js'
  ])
    .pipe(concat(libname + '.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('vendor:compile', shell.task([
  // Compile vendor dependencies
]));

gulp.task('vendor', ['vendor:compile'], () => {
  return gulp.src([
    './node_modules/d3/d3.min.js'
  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', ['concat'], () => {
  gulp.src('dist/' + libname + '.js')
    .pipe(uglify())
    .pipe(rename(libname + '.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test:unit', (done) => {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('jsinspect', () => {
  return gulp.src([
    'src/**/*.js',
    '!dist/**/*.js',
    '!src/utils/colors.js'
  ]).pipe(jsinspect());
});

gulp.task('doc', function (cb) {
  gulp.src(['./src/**/*.js'], { read: false })
    .pipe(jsdoc(cb));
});


gulp.task('watchFiles', () => {
  return watch('src/**/*.js', { ignoreInitial: true }).pipe(gulp.dest('build'));
})



//gulp.task('test', ['test:unit', 'test:e2e']);
gulp.task('test', ['test:unit']);

//gulp.task('build', ['test', 'syntax', 'vendor', 'minify']);
gulp.task('build', () => {
  var cache = null;

  rollup.rollup({
    // The bundle's starting point. This file will be
    // included, along with the minimum necessary code
    // from its dependencies
    entry: './index.js',
    // If you have a bundle you want to re-use (e.g., when using a watcher to rebuild as files change),
    // you can tell rollup use a previous bundle as its starting point.
    // This is entirely optional!
    cache: cache
  }).then(function (bundle) {
    // Generate bundle + sourcemap
    var result = bundle.generate({
      // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
      format: 'umd'
    });

    // Cache our bundle for later use (optional)
    cache = bundle;

    fs.writeFileSync('./build/bundle.js', result.code);

  });





});

gulp.task('default', ['test', 'build']);
