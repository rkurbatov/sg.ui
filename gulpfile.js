'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'build/';

gulp.task('default', createDeploymentVersion);

function createDeploymentVersion() {
  return gulp.src(['src/sg.ui.js', 'src/*.js'])
      .pipe(concat('sg.ui.js'))
    // This will output the non-minified version
      .pipe(gulp.dest(DEST))
    // This will minify and rename to foo.min.js
      .pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest(DEST));
}