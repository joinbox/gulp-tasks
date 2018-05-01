const gulp = require('gulp');
const gulpif = require('gulp-if');
const path = require('path');
const htmlmin = require('gulp-htmlmin');
const colors = require('colors');
const print = require('gulp-print').default;
const getPath = require('./getPath');

module.exports = function createTemplateTasks(templateConfig, paths, environment) {

	const sources = getPath(paths, templateConfig.paths);
	const destination = getPath(paths, templateConfig.paths, 'destination');
	const entries = templateConfig.paths.entries.map((entry) => {
		return path.join(sources, entry);
	});

	console.log(colors.blue('createTemplateTasks: Entries are %s, destination %s'), entries, 
		destination);

	return function() {
		return gulp.src(entries)
			.pipe(print())
			// This is dangerous/unexpected, consult case 1 on https://github.com/robrich/gulp-if
			// Make sure gulpif comes straight before gulp.dest!
			.pipe(gulpif(environment === 'production', htmlmin({
				// Options: https://github.com/kangax/html-minifier
				collapseWhitespace: true,
				conservativeCollapse: true,
				preserveLineBreaks: true,
			})))
			.pipe(gulp.dest(destination));
	};

};