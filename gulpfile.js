'use strict';

var Gulp = require('gulp');
var gulp = require('gulp-load-plugins')();

var DEST = 'dist/';
var version = require('./package.json').version;

Gulp.task('default', deployBuild);
Gulp.task('release', ['deploy:build'], deployRelease);
Gulp.task('bumpMajor', bumpVersion('major'));
Gulp.task('bumpMinor', bumpVersion('minor'));
Gulp.task('bumpPatch', bumpVersion('patch'));
Gulp.task('deploy:build', deployBuild);

function deployBuild() {
    return Gulp.src(['src/sg.ui.js', 'src/*.js'])
        .pipe(gulp.concat('sg.ui.js'))
        // This will output the non-minified version
        .pipe(Gulp.dest(DEST))
        // This will minify and rename to foo.min.js
        .pipe(gulp.uglify())
        .pipe(gulp.rename({extname: '.min.js'}))
        .pipe(Gulp.dest(DEST));
}

function deployRelease() {
    return Gulp.src('./*')
        .pipe(gulp.excludeGitignore())
        .pipe(gulp.git.add())
        .on('end', function(){
            return Gulp.src('./*')
                .pipe(gulp.excludeGitignore())
                .pipe(gulp.git.commit('Dist files for version ' + version))
                .on('end', function () {
                    gulp.git.tag('v' + version, 'Release ' + version, function (err) {
                        if (err) throw err;
                        gulp.git.push('origin', 'master', {args: '--tags'});
                    });
                });
        });

}

function bumpVersion(bumpType) {
    return function () {
        Gulp.src('./package.json')
            .pipe(gulp.bump({type: bumpType}))
            .pipe(Gulp.dest('./'))
            .pipe(gulp.git.commit("Bump package version"));
    }
}