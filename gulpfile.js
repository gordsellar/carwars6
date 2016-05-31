/* global require */
(function() {
    "use strict";

    var qaStatus = '!**/carwars-qa.js';

    var gulp = require('gulp'),
        jshint = require('gulp-jshint'),
        concat = require('gulp-concat'),
        notify = require('gulp-notify'),
        rename = require('gulp-rename'),
        uglify = require('gulp-uglify'),
        del = require('del'),
        runSequence = require('run-sequence'),
        templateCache = require('gulp-angular-templatecache');

    gulp.task("mkdirs", function() {
        return gulp.src('src') // Just pick any directory to use as the template
            .pipe(rename("designs"))
            .pipe(gulp.dest('target/ui/content/'))
            .pipe(rename("pdfs"))
            .pipe(gulp.dest('target/ui/content/'));
    });
    gulp.task("carwars", function () {
        return gulp.src(['src/main/ui/carwars/*.js','src/main/ui/version.js',qaStatus])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(concat('carwars.js'))
            .pipe(gulp.dest('target/ui/js/'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('target/ui/js/'))
//            .pipe(notify({message: 'Carwars scripts combined'}))
            ;
    });
    gulp.task("admin", function () {
        return gulp.src(['src/main/ui/admin/controllers/*.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(concat('admin.js'))
            .pipe(gulp.dest('target/ui/js/'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('target/ui/js/'));
    });
    gulp.task("angular", function () {
        return gulp.src(['src/main/ui/common/*.js', 'src/main/ui/controllers/*.js', 'src/main/ui/directives/*.js', 'src/main/ui/services/*.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(concat('angular-app.js'))
            .pipe(gulp.dest('target/ui/js/'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('target/ui/js/'))
//            .pipe(notify({message: 'Angular scripts combined'}))
            ;
    });
    gulp.task("views", function () {
        gulp.src('src/main/ui/**/*.html')
            .pipe(templateCache('views.js', {module: 'carwars'}))
            .pipe(gulp.dest('target/ui/js'))
        ;
    });
    gulp.task("boot", function () {
        return gulp.src(['src/main/ui/boot.js','src/main/ui/routing.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(gulp.dest('target/ui/js/'))
//            .pipe(notify({message: 'Boot scripts copied', onLast: true}))
            ;
    });
    gulp.task('clean', function (cb) {
        del(['dist/**', '!dist'], cb);
    });
    gulp.task('default', function (cb) {
        runSequence('clean',
            ['boot', 'carwars', 'angular', 'admin', 'views', 'mkdirs'],
            cb
        );
    });
    gulp.task('qa', function() {
        qaStatus = '**/carwars-qa.js';
        runSequence('default');
    });

    gulp.task('clean-local', function (cb) {
        del(['dist/vendor','dist/.idea','dist/*~', 'target/ui/content'], cb);
    });
    gulp.task('sync', function (cb) {
        runSequence('default', 'clean-local', cb);
    });

    gulp.task('cdn', function () {
        return gulp.src(['test/cdn/*.js', 'test/cdn/*.css'])
            .pipe(gulp.dest('target/ui/cdn/'))
//            .pipe(notify({message: 'CDN content copied', onLast: true}))
            ;
    });
    gulp.task('cdnfonts', function () {
        return gulp.src(['test/cdn/*.eot', 'test/cdn/*.svg', 'test/cdn/*.ttf', 'test/cdn/*.woff'])
            .pipe(gulp.dest('target/ui/fonts/'))
//            .pipe(notify({message: 'CDN fonts copied', onLast: true}))
            ;
    });
    gulp.task('offline', ['default'], function () {
        gulp.start('cdn', 'cdnfonts');
    });

    gulp.task('populate', function() {
        return gulp.src('src/designs/*.*')
            .pipe(gulp.dest('target/ui/content/designs/'))
//            .pipe(notify({message: 'Stock Car data copied', onLast: true}))
            ;
    });
})();