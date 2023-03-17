// gulpfile.js
var gulp = require('gulp');
// css
var postcss = require('gulp-postcss');
var tailwindcss = require('tailwindcss');
var autoprefixer = require('autoprefixer');
var postcssimport = require('postcss-import');
var clean = require('gulp-clean-css');
// js
var uglify = require('gulp-uglify');
// ts
var ts = require("gulp-typescript");
// concat
var concat = require('gulp-concat');

// 压缩 css
gulp.task('css', done => {
    gulp.src('css/*.css')
        .pipe(postcss(
            [
                postcssimport,
                autoprefixer,
                tailwindcss
            ]
        ))
        .pipe(clean())
        .pipe(concat('luminedge.min.css'))
        .pipe(gulp.dest('.'));
    done();
});

// 编译 ts
gulp.task("typescript", function () {
    var tsResult = gulp.src("typescript/*.ts")
        .pipe(ts({
            noImplicitAny: true,
            out: "typescript.js"
        }));
    return tsResult.js.pipe(gulp.dest('javascript'));
});

// 压缩 js
gulp.task('javascript', done => {
    gulp.src('javascript/*.js')
        .pipe(uglify())
        .pipe(concat('luminedge.min.js'))
        .pipe(gulp.dest('.'));
    done();
});

// 先编译 css 然后压缩 js / ts 和 css 最后打包成单个文件
gulp.task('build', gulp.series('css', 'typescript', 'javascript'));