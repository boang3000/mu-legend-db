var gulp = require('gulp-help')(require('gulp')),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify-css'),
    sh = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    runSequence = require('run-sequence');

var resources = {
    "app": {
        "js": [
            "node_modules/jquery/dist/jquery.js",
            "node_modules/angular/angular.js",
            "node_modules/@uirouter/angularjs/release/angular-ui-router.js",
            "node_modules/@uirouter/angularjs/release/stateEvents.js",
            "node_modules/popper.js/dist/umd/popper.js",
            "node_modules/bootstrap/dist/js/bootstrap.js",
            "node_modules/ngstorage/ngStorage.js",
            "node_modules/angular-filter/dist/angular-filter.js",
            "node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js",
            "node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
            "node_modules/angular-sanitize/angular-sanitize.js",
            "node_modules/ui-select/dist/select.js",
            
            "www/app/app.js",
            "www/app/controller/**.js",
            "www/app/directives/*.js",
            "www/app/filters/*.js",
            "www/app/services/**.js",
            "www/app/lib/*.js"
        ],
        "css": {
            "src": "www/assets/sass/app.scss"
        },
        "images": [
            "www/assets/img/**.*",
            "www/assets/img/**/**.*"
        ],
        "fonts": [
            "www/assets/fonts/*.*",
        ]
    }
};

var paths = {
    "app": "www/build/",
    "js": "www/build/js/",
    "css": "www/build/css/",
    "img": "www/build/img/",
    "fonts": "www/build/fonts/",
    "sassPath": "www/assets/sass/"
}

gulp.task('clean:app', 'Clean public app folders', function() {
    // sh.rm('-rf', paths.app);
    // sh.mkdir('-p', paths.app);
    sh.mkdir('-p', path.join(paths.app));
    // sh.mkdir('-p', path.join(paths.app, 'js'));
    // sh.mkdir('-p', path.join(paths.app, 'img'));
});

gulp.task('build:app', 'Build the website app', function(callback) {
    runSequence('clean:app', [
        'css',
        'js',
        'images',
        'fonts'
    ], callback);
});

gulp.task('js', false, function() {
    return gulp.src(resources.app.js)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        // .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(paths.js)))
        .pipe(notify({ message: 'App javascript successfully builded!', onLast: true }));
});

gulp.task('css', false, function() {
    return gulp.src(resources.app.css.src)
        .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                "www/assets/sass/*/**.scss"
            ],
            errLogToConsole: true
        }))
        .pipe(minify())
        .pipe(autoprefixer())
        .pipe(concat('app.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.join(paths.css)))
        .pipe(notify({ message: 'App stylesheets successfully builded!', onLast: true }));
});

gulp.task('images', false, function() {
    return gulp.src(resources.app.images)
        .pipe(gulp.dest(path.join(paths.img)))
        .pipe(notify({ message: 'App images successfully builded!', onLast: true }));
});

gulp.task('fonts', false, function() {
    return gulp.src(resources.app.fonts)
        .pipe(gulp.dest(path.join(paths.fonts)))
        .pipe(notify({ message: 'App fonts successfully builded!', onLast: true }));
});

gulp.task('watch', false, function() {
    gulp.watch(paths.sassPath + '/**/**.scss', ['css']);
    gulp.watch(resources.app.js, ['js']);
});