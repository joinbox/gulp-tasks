// gulp-notifier has write method which is needed but not documented – don't use it
const notifier = require('node-notifier');
const webpack = require('webpack');
const colors = require('colors');

const getWebpackConfig = require('./getWebpackConfig');
const getNotificationOptions = require('./getNotificationOptions');


module.exports = function createScriptTasks(scriptConfig, pathConfig, browsers, environment) {

	/**
	 * Basic JS task for dev and production mode
	 * Don't use webpack-stream in combination with gulp because: 
	 * - directories are not preserved, see https://github.com/shama/webpack-stream/issues/62
	 * - it's overly complex (error handling, sourcemaps, named() for multiple files …)
	 * @return {object} 		Exported gup tasks
	 */
	return function(done) {

		const webpackConfig = getWebpackConfig(scriptConfig, pathConfig, browsers, environment);
		//console.log('Scripts: webpack config is %o', webpackConfig);

		webpack(webpackConfig).run((err, stats) => {

			let notificationOptions;
			// Basic error
			if (err) notificationOptions = getNotificationOptions('Scripts', err);
			// Error when compiling a single or multiple files
			else if (stats.compilation.errors && stats.compilation.errors.length) {
				notificationOptions = getNotificationOptions('Scripts', 
					new Error(stats.compilation.errors));
				console.error(stats.compilation.errors);
			}
			// All fine
			else {
				const assets = Object.keys(stats.compilation.assets).join(', ');
				notificationOptions = getNotificationOptions('Scripts', assets);
				console.log(colors.yellow('Webpack: Result is %s'), stats.toString());
			}
			//console.log(stats.compilation);
			notifier.notify(notificationOptions);
			done();
		
		});
	};

};


