'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const server = require('karma').Server;
const babel = require('gulp-babel');
const rename = require('gulp-rename');

const libname = 'proteus-charts';

gulp.task('babel', (cb) => {
  let task = gulp.src('src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib/'));
  setTimeout(cb, 2000);
});

gulp.task('concat', ['babel'], (cb) => {
  let task = gulp.src([
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

  setTimeout(cb, 4000);
});

//+ libname + '.min.js'
gulp.task('minify', ['concat'], (cb) => {
  let task = gulp.src('dist/' + libname + '.js')
    .pipe(uglify())
    .pipe(rename(libname + '.min.js'))
    .pipe(gulp.dest('dist'));

  setTimeout(cb, 6000);
});

gulp.task('test', (done) => {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['test', 'babel', 'concat', 'minify']);
