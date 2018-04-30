const gulp = require('gulp');
const path = require('path');
const print = require('gulp-print').default;
const getSources = require('./getSources');

module.exports = function createTemplateTasks(templateConfig, paths) {

	return function() {
		return gulp.src(getSources(paths, templateConfig.paths))
			.pipe(print())
			.pipe(gulp.dest(path.join(paths.base, paths.destination, templateConfig.paths.base)));
	};

};