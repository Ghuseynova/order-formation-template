const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const sourceMaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('sass', () => {
	return gulp
		.src('src/scss/style.scss')
		.pipe(plumber())
		.pipe(sourceMaps.init())
		.pipe(sass())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 2 version'],
			})
		)
		.pipe(sourceMaps.write())
		.pipe(gulp.dest('build/assets/css'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('pug', () => {
	return gulp
		.src('src/template/*.pug')
		.pipe(plumber())
		.pipe(
			pug({
				pretty: true,
			})
		)
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('js', () => {
	return gulp
		.src('src/js/main.js')
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(uglify())
		.pipe(gulp.dest('build/assets/js'))
		.pipe(browserSync.reload({ stream: true }));
});

// gulp.task('vendors', () => {
// 	return gulp
// 		.src([])
// 		.pipe(concat('vendors.js'))
// 		.pipe(uglify())
// 		.pipe(gulp.dest('build/assets/js'))
// 		.pipe(browserSync.reload({ stream: true }));
// });

gulp.task('allimg', () => {
	return gulp
		.src('src/img/**/*')
		.pipe(gulp.dest('build/assets/img'))
		.pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', () => {
	return gulp
		.src('build/assets/img/**/*')
		.pipe(
			imagemin([
				imagemin.jpegtran({ progressive: true }),
				imageminJpegRecompress({
					loops: 5,
					min: 65,
					max: 70,
					quality: 'medium',
				}),
				imagemin.optipng({ optimizationLevel: 3 }),
				pngquant({ quality: [0.6, 0.7], speed: 5 }),
			])
		)
		.pipe(gulp.dest('build/assets/img'));
});

gulp.task('svg', () => {
	return gulp
		.src('src/img/icons/*.svg')
		.pipe(
			svgmin({
				js2svg: {
					pretty: true,
				},
			})
		)
		.pipe(
			cheerio({
				run: function ($) {
					console.log($);
					$('fill').removeAttr('fill');
					$('stroke').removeAttr('stroke');
					$('style').removeAttr('style');
				},
				parserOptions: { xmlMode: true },
			})
		)
		.pipe(replace('&gt;', '>'))
		.pipe(
			svgSprite({
				mode: {
					symbol: {
						sprite: 'sprite.svg', //sprite file name
					},
				},
			})
		)
		.pipe(gulp.dest('build/assets/img/icons'));
});

gulp.task('fonts', () => {
	return gulp.src('src/fonts/**/*').pipe(gulp.dest('build/assets/fonts'));
});

gulp.task('serve', () => {
	browserSync.init({
		server: 'build',
	});

	gulp.watch('src/scss/**/*.scss', gulp.series('sass'));
	gulp.watch('src/template/*.pug', gulp.series('pug'));
	gulp.watch('src/js/main.js', gulp.series('js'));
	gulp.watch('src/img/**/*.{png,jpg}', gulp.series('allimg'));
	gulp.watch('src/img/**/*.{svg}', gulp.series('svg'));
	gulp.watch('src/fonts/**/*', gulp.series('fonts'));
});

gulp.task('del', () => {
	return del('build');
});

gulp.task(
	'build',
	gulp.series(
		'del',
		'sass',
		'pug',
		'js',
		// 'vendors',
		'allimg',
		'svg',
		'fonts',
		(done) => {
			done();
		}
	)
);
