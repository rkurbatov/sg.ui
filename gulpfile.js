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

gulp.task('default', deployBuild);
gulp.task('deploy', ['deploy:build', 'deploy:commit']);
gulp.task('bumpMajor', bumpVersion('major'));
gulp.task('bumpMinor', bumpVersion('minor'));
gulp.task('bumpPatch', bumpVersion('patch'));
gulp.task('deploy:build', deployBuild);
gulp.task('deploy:commit', deployCommit);

function deployBuild() {
    return gulp.src(['src/sg.ui.js', 'src/*.js'])
        .pipe(concat('sg.ui.js'))
        // This will output the non-minified version
        .pipe(gulp.dest(DEST))
        // This will minify and rename to foo.min.js
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(DEST));
}

function deployCommit() {
    return gulp.src('./*')
        .pipe(excludeGitignore())
        .pipe(git.add())
        .pipe(git.commit('Dist files for version ' + version));
        /*.on('end', function () {
            git.tag('v' + version, 'Release ' + version, function (err) {
                if (err) throw err;
                git.push('origin', 'master', {args: '--tags'});
            });
        });*/
}

function bumpVersion(bumpType) {
    return function () {
        gulp.src('./package.json')
            .pipe(bump({type: bumpType}))
            .pipe(gulp.dest('./'))
            .pipe(git.commit("Bump package version"));
    }
}