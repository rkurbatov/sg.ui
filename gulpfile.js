'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var excludeGitignore = require('gulp-exclude-gitignore');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'dist/';
var version = require('./package.json').version;

gulp.task('default', build);
gulp.task('bumpMajor', bumpVersion('major'));
gulp.task('bumpMinor', bumpVersion('minor'));
gulp.task('bumpPatch', bumpVersion('patch'));
gulp.task('release', release);
gulp.task('build', build);


function build() {
    return gulp.src(['src/sg.ui.js', 'src/*.js'])
        .pipe(concat('sg.ui.js'))
        // This will output the non-minified version
        .pipe(gulp.dest(DEST))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(DEST));
}

function release(){
    return gulp.src('./*')
        .pipe(excludeGitignore())
        .pipe(git.commit('Dist files for version ' + version))
        .pipe(git.tag(version, 'Release + version'))
        .pipe(git.push('origin', 'master', {args: '--tags'}, function(err){
            if (err) throw err;
        }))
        .pipe(gulp.dest('./'));
}

function bumpVersion(bumpType) {
    return function () {
        gulp.src('./package.json')
            .pipe(bump({type: bumpType}))
            .pipe(gulp.dest('./'))
            .pipe(git.commit("Bump package version"));
    }
}