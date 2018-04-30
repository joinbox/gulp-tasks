const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const notifier = require('node-notifier');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const calc = require('postcss-calc');
const plumber = require('gulp-plumber');
const print = require('gulp-print').default;
const colors = require('colors');

const getNotificationOptions = require('./getNotificationOptions');
const getSources = require('./getSources');

module.exports = function createStyleTasks(styleConfig, paths, browsers) {

	return function() {

		const sources = getSources(paths, styleConfig.paths);
		const destinationPath = path.join(paths.base, paths.destination, styleConfig.paths.base);
		console.log(colors.green('Styles: Sources are %s, destination is %s'), sources.join(', '), 
			destinationPath);

		return gulp.src(sources)
			.pipe(plumber({
				errorHandler: () => (err) => notifier.notify(getNotificationOptions('Styles', err))
			}))
			.pipe(print())
			.pipe(sassGlob())
			.pipe(sass())

			.pipe(postcss([
				autoprefixer({
					browsers: browsers
				}),
				pxtorem({
					propWhiteList: [],
					rootValue: 16
				}),
				calc
			]))

			.pipe(gulp.dest(destinationPath))
			//.pipe(browsersync.reload({stream: true}))
			//.pipe(browsersyncPatternlab.reload({stream: true}))
			.on('end', () => notifier.notify(getNotificationOptions('Styles')));

	};

};