var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function() {
  return gulp.src('./lib/*.js')
    .pipe(concat('angular-images-uploader.js'))
    .pipe(gulp.dest('./dist/'));
});