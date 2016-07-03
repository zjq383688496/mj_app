'use strict';

var localhost = process.env.localhost || 'false';
var env       = process.env.NODE_ENV  || 'development';
var online;
var noLocal;
noL();

function noL() {
	online  = localhost == 'false'? env: 'localhost';
	noLocal = (online != 'localhost');
	console.log(noLocal);
}

var gulp        = require('gulp');
/* html */
var minifyHTML  = require('gulp-minify-html');	// html压缩
var replace     = require('gulp-replace');		// 替换
/* css */
var less        = require('gulp-less');			// less编译
var csso        = require('gulp-csso');			// css压缩
/* js */
var coffee      = require('gulp-coffee');		// coffee-script编译
var babel       = require('gulp-babel');		// ES2015(ES6)编译
var uglify      = require('gulp-uglify');		// js混淆
/* img */
//var imagemin    = require('gulp-imagemin');
/* 文件操作 */
var filter      = require('gulp-filter');		// 文件合并
var concat      = require('gulp-concat');		// 文件合并
var clean       = require('gulp-clean');		// 文件清除
var sourcemaps  = require('gulp-sourcemaps');	// sourcemaps生成
var rename      = require('gulp-rename');		// 文件重命名
/* 版本号管理 */
var rev         = require('gulp-rev');
var revReplace  = require('gulp-rev-replace');
/* server */
var browserSync = require('browser-sync');		// 浏览器同步
var nodemon     = require('gulp-nodemon');		// 自动部署
/* 工程相关 */
var gulpif      = require('gulp-if');			// 条件判断
var runSequence = require('gulp-sequence');		// 执行队列

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
var BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', function(cb) {
	var called = false;
	return nodemon({

		// nodemon our expressjs server
		script: 'bin/www',
		env: {
			localhost: localhost,
			NODE_ENV: env
		},
		ext: '*',
		nodeArgs: ['--debug'] //install -g node-inspector //run node-inspector
			// watch core server file(s) that require server restart on change
			// watch: ['views','routes']
	})
	.on('start', function onStart() {
		// ensure start only got called once
		if (!called) {
			cb();
		}
		called = true;
	})
	.on('restart', function onRestart() {
		// reload connected browsers after a slight delay
		setTimeout(function reload() {
			browserSync.reload({ stream: false });
		}, BROWSER_SYNC_RELOAD_DELAY);
	});
});

gulp.task('browser-sync', function() {
	// for more browser-sync config options: http://www.browsersync.io/docs/options/
	browserSync.init({
		// watch the following files; changes will be injected (css & images) or cause browser to refresh
		files: ['public/**/*.*'],
		// informs browser-sync to proxy our expressjs app which would run at the following location
		proxy: 'http://localhost:3010',
		// informs browser-sync to use the following port for the proxied app
		// notice that the default port is 3000, which would clash with our expressjs
		port: 4010,
		// open the proxied app in chrome
		browser: 'default'
	});
});

gulp.task('default', ['browser-sync']);

/* 编译LESS */
gulp.task('less', function() {
	var lessSrc = ['public/less/**/*.less', '!public/less/common/*.less'];
	var cssDest = noLocal? 'public/build/css': 'public/css';
	if (noLocal) {
		return gulp.src(lessSrc)
		.pipe(less())
		.pipe(rev())
		.pipe(csso())
		.pipe(gulp.dest(cssDest))
		.pipe(rev.manifest({
			base: 'public/build',
			merge: true // merge with the existing manifest (if one exists)
		}))
		.pipe(gulp.dest('build/assets'));
	} else {
		return gulp.src(lessSrc)
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(less())
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest(cssDest));
	}
});

/* 编译ES6 to JS */
gulp.task('ES6', function() {
	var jsSrc = ['public/ES6/**/*.es6'];
	var jsDest = 'public/dist/js';
	return gulp.src(jsSrc)
	.pipe(babel({ presets: ['es2015'] }))
	.pipe(gulp.dest(jsDest));
});

/* 编译COFFEE to JS */
gulp.task('coffee', function() {
	var jsSrc  = ['public/coffee/**/*.coffee'];
	var jsDest = 'public/dist/js';
	return gulp.src(jsSrc)
	.pipe(sourcemaps.init({ loadMaps: true }))
	.pipe(coffee())
	.pipe(sourcemaps.write('/'))
	.pipe(gulp.dest(jsDest));
});

/* 业务类js */
gulp.task('jsc', function() {
	var jsSrc  = ['public/js/*.js'];
	var jsDest = 'public/build/js';
	if (noLocal) {
		gulp.src(jsSrc)
		.pipe(gulp.dest(jsDest));
	}
});

/* 合并lib.js */
gulp.task('concat', function() {
	var p = 'public/js/lib/';
	var jsSrc  = [p+'jquery.js', p+'bootstrap.js', p+'MJJS.js', p+'common.js'];
	var jsDest = 'public/dist/js';
	if (noLocal) {
		gulp.src(jsSrc)
		.pipe(concat('lib.js'))
		.pipe(gulp.dest(jsDest));
	}
});

/* 压缩JS */
gulp.task('js', function() {
	var jsSrc  = ['public/dist/js/*.js', 'public/build/js/*.js'];
	var jsDest = 'public/build/js';
	if (noLocal) {
		return gulp.src(jsSrc)
		.pipe(rev())
		.pipe(uglify())
		.pipe(gulp.dest(jsDest))
		.pipe(rev.manifest({
			base: 'public/build',
			merge: true // merge with the existing manifest (if one exists)
		}))
		.pipe(gulp.dest('build/assets'));
	}
});

gulp.task('util', function() {
	var jsSrc  = ['public/js/util/**/*'];
	var jsDest = 'public/build/js/util';
	if (noLocal) {
		return gulp.src(jsSrc)
		.pipe(gulp.dest(jsDest));
	}
});

gulp.task('images', function() {
	if (noLocal) {
		return gulp.src('public/img/**/*')
		.pipe(rev())
		// .pipe(imagemin({
		//   optimizationLevel: 3,
		//   progressive: true,
		//   interlaced: true
		// }))
		.pipe(gulp.dest('public/build/img'))
		.pipe(rev.manifest({
			base: 'public/build',
			merge: true // merge with the existing manifest (if one exists)
		}))
		.pipe(gulp.dest('build/assets'));
	}
});

/* 字体Copy */
gulp.task('fonts', function() {
	if (noLocal) {
		return gulp.src('public/fonts/**/*')
		.pipe(gulp.dest('public/build/fonts'));
	}
});

gulp.task('revReplace', function() {
	var manifest = gulp.src('rev-manifest.json');
	if (noLocal) {
		return gulp.src('views/**/*.hbs')
		.pipe(revReplace({
			manifest: manifest,
			replaceInExtensions: ['.hbs']
		}))
		.pipe(rename({ extname: '.html' }))
		.pipe(minifyHTML({
			empty: true,
			spare: true
		}))
		.pipe(rename({ extname: '.hbs' }))
		.pipe(gulp.dest('views/build'));
		}
});

gulp.task('build', function() {
	return runSequence(
		['clean:init'],
		['images', 'fonts', 'less', 'util', 'jsc'],
		//['ES6', 'coffee'],
		[ 'concat'],
		['js'],
		['revReplace'],
		['clean:end'],
		['nodemon'],
		['browser-sync']
	)();
});

gulp.task('build:localhost', function() {
	localhost = 'true';
	env = 'development';
	noL();
	gulp.start('build');
});

gulp.task('build:dev', function() {
	localhost = 'false';
	env = 'development';
	noL();
	gulp.start('build');
});

gulp.task('build:prd', function() {
	localhost = 'false';
	env = 'production';
	noL();
	gulp.start('build');
});

gulp.task('clean:init', function () {
	return gulp.src(['views/build', 'public/build', 'public/css', 'public/dist', 'rev-manifest.json', 'public/**/*.map'], {read: false}).pipe(clean());
});

gulp.task('clean:end', function () {
	return gulp.src(['public/dist', 'rev-manifest.json'], {read: false}).pipe(clean());
});