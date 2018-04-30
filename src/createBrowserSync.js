const gulp = require('gulp');
const path = require('path');
const browserSync = require('browser-sync').create();

module.exports = function createBrowserSync(templateConfig, paths) {
	
	// Path where files are served from
	const htmlDestPath = path.join(paths.base, paths.destination);
	// Path to watch – reload browserSync on changes
	const watchPath = path.join(htmlDestPath, templateConfig.paths.base) + '/' + 
		templateConfig.paths.entries;
	console.log('Serve: Serving from %s, watching %s', htmlDestPath, watchPath);

	function serve() {
		browserSync.init({
			server: htmlDestPath,
			startPath: templateConfig.paths.base,
		});

		gulp.watch(watchPath)
			.on('change', browserSync.reload);
	}

	return { serve };

};