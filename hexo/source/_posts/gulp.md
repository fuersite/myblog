---
title: gulp
date: 2018-02-03 12:46:39
categories: javascript
thumbnailImagePosition: right
autoThumbnailImage: yes
archive_pagination: 1
tags:
  - gulp
  - javascript
---

gulp 使用与配置
<!-- more -->

##### 1. 全局安装

``` bash
$ npm install --global gulp
```
##### 2. 作为项目开发依赖(devDependencies)安装

``` bash
$ npm install --save-dev gulp
```
##### 3. 在项目根目录下创建一个名为 gulpfile.js 的文件

``` bash
var gulp = require('gulp');

gulp.task('taskName', function() {
  // your task codes
});
```
##### 4. 基本概念
- src  : 匹配输出源文件, 类型 string 或者 Array
- pipe : 处理管道, 可迭代
- dest : 写人目标文件, 类型string 或者Array
- watch: 监听, 类型string 或者Array
- cb   : callback() 回调函数
- err  : 错误对象
- event: event 对象

``` bash
gulp.task('minified', function() {                 //创建 task
    return gulp.src('./client/templates/*.jade')   // 匹配源文件路径输出
      .pipe(jade())                                // 管道处理输出流
      .pipe(gulp.dest('./build/templates'))       // 写入目标文件
      .pipe(minify())
      .pipe(gulp.dest('./build/minified_templates'));
 }
```
##### 5. 序列化执行task
官网说明:如果你想要创建一个序列化的task队列，并以特定的顺序执行，你需要做两件事：

- 给出一个提示，来告知 task 什么时候执行完毕，
- 并且再给出一个提示，来告知一个 task 依赖另一个 task 的完成。

``` bash
var gulp = require('gulp');

// 返回一个 callback，因此系统可以知道它什么时候完成
gulp.task('one', function(cb) {
    // 做一些事 -- 异步的或者其他的
    cb(err); // 返回cb 有错误,则会停止后续操作,表示任务执行失败
});

// two 任务 依赖于 one 任务完成
gulp.task('two', ['one'], function() {
    // 'one' 完成后
});

gulp.task('default', ['one', 'two']);
```

##### 6. cb(event) callback 传入event对象

``` bash
// 每次变动都会打印event数据
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

##### 7. gulp.watch(glob[, opts, cb])
监听文件变化,执行task
``` bash
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
```
##### 8. 执行gulp 命令
``` bash
$ gulp // gulp 默认执行  gulp.task('default', function() {});
$ gulp taskname // 指定执行的task

// 如果在一些脚手架的项目下无法执行gulp 命令,可以把gulp 命令添加到package.json 中使用 npm 执行
  "scripts": {
    "watch": "gulp watch-scss"
  }
// 在命令窗口执行 npm run-script 或者 npm watch
$ npm run-script watch
```

example<font size= 4 color=#A52A2A>`gulpfile`</font>
<pre><code class="javascript">
  var gulp = require('gulp');
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

</code></pre>

参考[gulp官网][1]文档
[1]: https://www.gulpjs.com.cn/docs/api/
