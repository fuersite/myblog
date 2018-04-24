  var gulp = require('gulp');

  // acquire plugins
  var minifycss = require('gulp-minify-css');
  var uglify = require('gulp-uglify');
  var htmlmin = require('gulp-htmlmin');
  var htmlclean = require('gulp-htmlclean');
  var JSHint = require('gulp-jshint');
  var browserSync = require('browser-sync').create();
  var sass = require('gulp-sass');
  var reload = browserSync.reload;

  // js code check
  gulp.task('js-hint', function(){
    return gulp.src('./source/**/*.js')
     .pipe(JSHint())
     .pipe(JSHint.reporter('default'));
  });

  // compress public/**/*.css
  gulp.task('minify-css', function() {
    return gulp.src('./public/**/*.css')
      .pipe(minifycss())
      .pipe(gulp.dest('./public'));
  });

  // compress public/**/*.html
  gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
      .pipe(htmlclean())
      .pipe(htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      }))
      .pipe(gulp.dest('./public'))
  });

  // compress public/**/*.js
  gulp.task('minify-js', function() {
    return gulp.src('./public/**/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('./public'));
  });

  // watch public/**/*.js and on coding check (rules written into .jshintrc)
  gulp.task('watch-js',function(){
    gulp.watch('./source/**/*.js',['js-hint']);
  })

  // watch source/sass/*.scss and compile to css
  gulp.task('watch-scss', ['sass'], function() {
    gulp.watch("source/sass/*.scss", ['sass']);
  });

  // compile scss to css
  gulp.task('sass', function() {
    return gulp.src("source/sass/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("source/css"))
      .pipe(reload({stream: true}));
  });

  // execute default task by run command gulp
  gulp.task('default', [
    'minify-html', 'minify-css', 'minify-js', 'watch-js', 'watch-scss'
  ]);
