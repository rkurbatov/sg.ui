'use strict';

var gulp = require('gulp');
var bump = require('gulp-bump');
var git = require('gulp-git');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = 'dist/';
var version = require('./package.json').version;

gulp.task('default', build);
gulp.task('bumpMajor', bumpVersion('major'));
gulp.task('bumpMinor', bumpVersion('minor'));
gulp.task('bumpPatch', bumpVersion('patch'));
gulp.task('pushRelease', ['pushTags'], pushRelease);
gulp.task('build', build);
gulp.task('commit', ['build'], commit);
gulp.task('tagRelease', ['commit'], tagRelease);
gulp.task('pushTags', ['tagRelease'], pushTags);


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

function commit(){
    gulp.src('./dist/*')
        .pipe(git.commit('Dist files for version ' + version))
        .pipe(git.pull())
}

function tagRelease() {
    git.tag('v'+ version, 'Tagging version '+ version, function(err){
        if (err) throw err;
    });
}

function pushRelease() {
    git.push('origin', 'master', function(err){
        if(err) throw err;
    });
}

function pushTags() {
    git.push('origin', 'master', {args: '--tags'}, function(err){
        if (err) throw err;
    });
}

function bumpVersion(bumpType) {
    return function () {
        gulp.src('./package.json')
            .pipe(bump({type: bumpType}))
            .pipe(gulp.dest('./'))
            .pipe(git.commit("Bump package version: " + version));
    }
}