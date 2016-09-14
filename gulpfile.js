'use strict'

const gulp = require('gulp')
const clean = require('gulp-clean')
const zip = require('gulp-zip')
const ghPages = require('gulp-gh-pages')

const md5 = require('md5')(new Date())

gulp.task('deploy', function () {
  return gulp.src('./_book/**/*')
    .pipe(ghPages())
})

gulp.task('zip', ['clean'], function () {
  return gulp.start('zipBook', 'zipCode')
})

gulp.task('zipBook', function () {
  return gulp.src(['./_book/**/*'])
    .pipe(zip(`book-${md5}.zip`))
    .pipe(gulp.dest('./dist'))
})

gulp.task('zipCode', function () {
  return gulp.src(['./**/*', '!./node_modules', '!./node_modules/**/*', '!./_book/**/*'])
    .pipe(zip(`code-${md5}.zip`))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', function () {
  return gulp.src(['./dist/**/*'], {read: false})
    .pipe(clean())
})
