'use strict';

/* Подключаемые модули */
const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const notify = require('gulp-notify');
const include = require('gulp-file-include');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const minify = require("gulp-csso");
// const minifyJS = require('gulp-uglify');
const rename = require("gulp-rename");
const server = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const svgssprite = require("gulp-svgstore");
const del = require("del");
const replace = require("gulp-replace");
const debug = require("gulp-debug");
const newer = require("gulp-newer");
const sourcemaps = require("gulp-sourcemaps");

/* HTML */
gulp.task('html', function () {
  return gulp.src('source/*.html')                      // Откуда брать файлы
    .pipe(plumber({errorHandler: onError}))             // Проверка на ошибки и сообщение о них
    .pipe(include())                                    // Добавление файлов
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))     // Удаление кооментариев для разработки <!--DEV ... -->
    .pipe(gulp.dest('build'))                           // Куда сохоанить то что получилось
});

/* STYLES */
gulp.task('styles', function () {
  return gulp.src('source/sass/style.scss')             //
    .pipe(sourcemaps.init())                            // Инициализация карты кода
    .pipe(plumber({errorHandler: onError}))             //
    .pipe(sass({                                        // Преобразование из sass в css
      outputStyle: 'expanded'                           // Развернутый стиль сбора css файла с отступами
    })
    .on('error', sass.logError))                        //
    .pipe(postcss([                                     //
      autoprefixer({                                    //
        cascade: false
      })
    ]))
    .pipe(gulp.dest('build/css'))                       // Сохраняем получившийся css файл
    .pipe(minify())                                     // Минификацируем его
    .pipe(rename('style.min.css'))                      // Переименовываем минифицируванный файл
    .pipe(sourcemaps.write('.'))                        // Записываем карту кода как отдельный файл
    .pipe(gulp.dest('build/css'))                       //
    .pipe(server.stream());                             // Обновляем страницу при изменении стилей
});

/* JAVASCRIPT */
gulp.task('js', function () {
  return gulp.src('source/js/main.js')                   // Какие файлы брать
    .pipe(sourcemaps.init())
    .pipe(plumber({errorHandler: onError}))             // Проверка и сообщение об ошибках
    .pipe(gulp.dest('build/js'))                        // Сохраняем его в билд
    // .pipe(minifyJS())                                   // Минифицируем
    // .pipe(rename('main.min.js'))                        // Переименовываем минифицированную копию
    .pipe(sourcemaps.write('.'))                        // Записываем карту кода как отдельный файл
    .pipe(gulp.dest('build/js'))                        // Сохраняем минифицированный файл
});

/* SERVER */
gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  /* Следим за файлами и перезагружаем страницу если были изменения */
  gulp.watch('source/**/*.html', gulp.series('html')).on('change', server.reload);
  gulp.watch('source/js/**/*.js', gulp.series('js', 'copy')).on('change', server.reload);
  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('styles')).on('change', server.reload);; // Обновление страницы браузера в задаче 'styles'
  gulp.watch('source/css/**/*.css', gulp.series('copy')).on('change', server.reload);
  gulp.watch('source/img/**/*.{png,jpg,svg,gif}', gulp.series('imagesmin')).on('change', server.reload);
  gulp.watch('source/img/svg/**/*.svg', gulp.series('svgsprite', 'imagesmin')).on('change', server.reload);
  gulp.watch('source/fonts/**/*.*', gulp.series('copy')).on('change', server.reload);
});

/* SVG SPRITES */
gulp.task("svgsprite", function () {
  return gulp.src("source/img/svg/**/*.svg")                // Откуда брать svg для спрайта
    .pipe(svgssprite({                                      //
      inlineSvg: true                                       // Настройка для инлайна svg
    }))
    .pipe(rename("sprite.svg"))                             // Как будет называться файл с svg спрайтом
    .pipe(gulp.dest("source/img"));                         // Куда записать
});

/* MINIFY IMAGES */
gulp.task("imagesmin", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg,gif}")
    .pipe(newer("build/img"))                               // Пропускает только новые изображения, или если дата модификации более поздняя
    // (cache                                               //
    .pipe(imagemin([                                        // Минификация изображений
        imagemin.gifsicle({
          interlaced: true
        }),
        imagemin.optipng({                                  // Оптимизация png
          optimizationLevel: 3                              // Уровень сжатия
        }),
        imagemin.mozjpeg({
          progressive: true
        }),
        // imagemin.jpegtran({                                 // Оптимизация jpg
        //   progressive: true                                 // Прогрессивная загрузка
        // }),
        imagemin.svgo({                                     // Оптимизация svg
        plugins: [{
          removeViewBox: false                              // Не удалять viewbox
        },
        {
          cleanupIDs: false                                 // Не удалять ID
        }]
      })
    ]))
      // )
  .pipe(debug({title: 'imagesmin'}))                    // Показывает какие изображения минифицированы
  .pipe(gulp.dest("build/img"))                         // Куда сохранить изображения
});

/* IMAGES */
gulp.task('images', gulp.series('svgsprite', 'imagesmin', function (done) {
  done();
}));

/* COPY FILES FROM SOURCE */
gulp.task('copy', function () {
  return gulp.src([                                     // Что попировать
      'source/css/**/*.css',                            // Сss файлы без сжатия
      'source/js/**/*.js',                              // Копируем js
      'source/fonts/**/*.{woff,woff2,otf,ttf}',         // Шрифты
      'source/favicon/**/*.*'                           // фавиконки
    ], {
      base: 'source'                                    // Копируем файлы сохраняя файловую структуру
    }, {
      since: gulp.lastRun('copy')                       // Находим файлы, которые изменились с момента последнего запуска задачи copy
    })
    .pipe(newer('build'))                               // Сверяет файлы в исходной и конечной папке, пропуская если файла нет или дата модификации новее
    .pipe(debug({                                       // Запускаем дебаг чтобы увидеть какие файлы скопированы
      title: 'copy'                                     // Показывает какие файлы скопированы
    }))
    .pipe(gulp.dest('build'));                          // Куда копировать
});

/* On error message in plumber */
let onError = function(err) {
  notify.onError({
    title: err.plugin,
    message: err.message
  })(err);
  // this.emit('end');
};

/* REMOVE OLD BUILD */
gulp.task('clean', function () {
  return del('build');
});



/* TASKS */
gulp.task('build', gulp.series('clean', 'styles', 'copy', 'html', 'js', 'svgsprite', 'images', 'server'));
gulp.task('dev', gulp.series('styles', 'copy', 'html', 'js', 'svgsprite', 'images', 'server'));
