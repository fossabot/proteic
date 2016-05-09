'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const server = require('karma').Server;
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');

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
    './lib/utils/globals.js',
    './lib/svg/SvgStrategy.js',
    './lib/svg/svg.js',
    './lib/svg/strategy_barchart.js',
    './lib/svg/strategy_linechart.js',
    './lib/svg/strategy_streamgraph.js',
    './lib/charts/classes.js',
    './lib/charts/barchart.js',
    './lib/charts/linechart.js',
    './lib/charts/streamgraph.js'

  ])
    .pipe(concat(libname + '.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('vendor', () => {
  return gulp.src([
    './node_modules/d3/d3.min.js'

  ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', ['concat'], () => {
  return gulp.src('dist/' + libname + '.js')
    .pipe(uglify())
    .pipe(rename(libname + '.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('test', (done) => {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['test', 'syntax', 'babel', 'vendor', 'concat', 'minify']);

gulp.task('build', ['syntax', 'vendor', 'minify']);