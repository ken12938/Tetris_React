var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var resolutions = require('browserify-resolutions');
var eslint = require('gulp-eslint');
var path = require('path');
var zip = require('gulp-zip');

gulp.task('browserify', function () {
  var bundler = browserify({
    entries: ['./public/main.jsx'],
    paths: ['./node_modules','./public'],
    transform: [reactify],
    debug: true,
    // Required properties for watchify
    cache: {}, packageCache: {}, fullPaths: true
  }).plugin(resolutions, '*')
    .on('time', function (time) {
      console.log('Bundle updated in ' + (time / 1000) + 's.');
    });

  var watcher = watchify(bundler);

  var bundle = function () {
    watcher
      .bundle()
      .on('error', function (err) {
        console.log(err.toString());
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest('./public/build/'));
  };
  bundle();
  return watcher.on('update', function (filenames) {
    filenames.forEach(function (filename) {
      console.log(path.relative(__dirname, filename) + ' changed.');
    });
    bundle();
  });
});

gulp.task('default', ['browserify']);

var JS = [
  'public/**/*.jsx',
  'public/actions/*.js',
  'public/reducers/*.js',
  'public/main.jsx'
];

var BRUCE_FILES = [
  'public/**/*'
];

gulp.task('eslint', function () {
  return gulp.src(JS)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('zip', function () {
  return gulp.src(BRUCE_FILES, { base: '.' })
    .pipe(zip('files.zip'))
    .pipe(gulp.dest(''));
});
