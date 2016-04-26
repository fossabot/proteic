const gulp = require('gulp');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const server = require('karma').Server;


gulp.task('concat', () => {
  return gulp.src([
    './src/utils/globals.js',
    './src/utils/svg.js',
    './src/charts/classes.js',
    './src/charts/barchart.js',
    './src/charts/streamgraph.js'
  ])
    .pipe(concat('proteus-charts.js'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', () => {
  return gulp.src('./dist/es5/proteus-charts.js')
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('./min'));
});

gulp.task('test', (done) => {
  new server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['test', 'concat', 'minify']);