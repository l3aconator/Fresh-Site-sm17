const gulp = require('gulp'),
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlreplace = require('gulp-html-replace'),
    replace = require('gulp-replace'),
    runSequence = require('run-sequence'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    svgo = require('gulp-svgo'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create();

const config = {
    scripts: {
        src: [
            './src/js/*.js'
        ],
        dest: './dist/js-min'
    },

    index: {
        src: './header.php',
        dest: './'
    },

    sass: {
        src: './src/styles/scss/**/*.scss'
    },

    css: {
        src: './src/styles/css/styles.css',
        dest: './dist/css-min'
    },

    templates: {
        src: './**/*.php'
    }
};

gulp.task('minify-css', function() {
	return gulp.src(config.css.src)
    .pipe(rename('styles.min.css'))
	.pipe(gulp.dest(config.css.dest))
    .pipe(browserSync.stream());
});

gulp.task('image-min', function() {
    gulp.src('src/imgf/*')
   .pipe(imagemin())
   .pipe(svgo())
   .pipe(gulp.dest('dist/image-min'));
});

gulp.task('sass', function() {
	return gulp.src(config.sass.src)
    .pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest('./src/styles/css'))
	.pipe(browserSync.stream());
});

gulp.task('sass-build', function () {
	runSequence('sass', 'minify-css');
});

gulp.task('sass:watch', ['minify-css'], function () {
	gulp.watch(config.sass.src, ['sass']);
});

// gulp.task('scripts', function() {
//     return gulp.src(config.scripts.src)
//     .pipe(sourcemaps.init())
//     .pipe(concat('scripts.js'))
//     .pipe(rename('scripts.min.js'))
//     .pipe(uglify())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest(config.scripts.dest))
//     .pipe(browserSync.stream());
// });

gulp.task('devHeaderReplace', function() {
    return gulp.src('./header.php')
    .pipe(htmlreplace({
        'css': {
            src: 'src/styles/css/load.css',
            tpl: '<!-- build:css --><link href="%s" rel="stylesheet"><!-- endbuild -->'
        }
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('devScriptsReplace', function() {
    return gulp.src('./header.php')
    .pipe(htmlreplace({
        'css': {
            src: 'src/styles/css/load.css',
            tpl: '<!-- build:css --><link href="%s" rel="stylesheet"><!-- endbuild -->'
        }
    }))
    .pipe(gulp.dest('./'))
});

gulp.task('devImagesReplace', function() {
    // return gulp.src('./header.php')
    // blank
});

gulp.task('dev', function() {
    // .pipe(replace('dist/img-min/', 'src/img/'))
    // .pipe(gulp.dest(config.index.dest))

    browserSync.init({
        proxy: "http://fresh-site.dev:8888/"
    })

    runSequence('sass', 'devHeaderReplace', 'devScriptsReplace', 'devImagesReplace');

    gulp.watch(config.scripts.src, ['scripts'])
    gulp.watch(config.sass.src, ['sass'])
    gulp.watch('src/img').on('change', browserSync.reload);
    gulp.watch(config.templates.src).on('change', browserSync.reload);
});

// gulp.task('build', function() {
//
//     gulp.src(config.index.src)
//     .pipe(htmlreplace({
//         'css': {
//             src: 'css-min/styles.min.css',
//             tpl: '<!-- build:css --><link href="%s" rel="stylesheet"><!-- endbuild -->'
//         },
//         'js': {
//             src: 'js-min/scripts.min.js',
//             tpl: '<!-- build:js --><script src="%s"></script><!-- endbuild -->'
//         }
//     }))
//     .pipe(replace('src/img/', 'img-min/'))
//     .pipe(gulp.dest('dist/'))
//
//     runSequence('sass-build', 'scripts', 'image-min')
// });
