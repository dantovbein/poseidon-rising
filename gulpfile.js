'use strict';

var gulp = require('gulp');
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');


gulp.task('connect',function(){
	connect.server({
		root: 'www',
		port: 8888,
		livereload: true
	});
});

gulp.task('html', function () {
  	gulp.src('./www/*.html')
		.pipe(connect.reload())
});

gulp.task('css',function(){
	gulp.src('./www/css/*.css')
		.pipe(connect.reload())
});

gulp.task('js',function(){
	gulp.src('./www/js/*.js')
		.pipe(connect.reload())
});

gulp.task('sass', function () {
    gulp.src('./sass/main.scss')
        .pipe(sass({errLogToConsole: true,indentedSyntax: true}))
        .pipe(gulp.dest('./www/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.sass', ['sass']);
});

gulp.task('watch', function () {
  gulp.watch(['./www/*.html','./www/css/*.css','.www/js/*.js'], ['html','sass:watch','js']);
});

gulp.task('default',['connect','watch']);


gulp.task('libs', function(){
	gulp.src('./www/js/libs.js',{ read:false })
		.pipe(browserify())
		.pipe(rename('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./www/js'))
});