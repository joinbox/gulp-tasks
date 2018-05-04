const path = require('path');
const getPath = require('./getPath');
const colors = require('colors');
const browserSync = require('browser-sync').create();

/**
 * Create server
 * @param  {object} serverConfig    Config for server
 * @param  {paths} paths            Config for paths
 * @param  {EventEmitter} watcher   Event emitter that emits events on change (js, css, html files 
 *                                  etc.)
 */
module.exports = function createBrowserSync(serverConfig, paths, watcher) {
    
    // Path where files are served from
    const htmlDestPath = getPath(paths, serverConfig.paths);
    // Path to watch – reload browserSync on changes
    const watchPath = path.join(htmlDestPath, serverConfig.paths.watch);

    console.log(colors.blue('Serve: Serving from %s, watching %s'), htmlDestPath, watchPath);

    return function() {
        browserSync.init({
            server: path.join(paths.base, paths.destination),
            startPath: serverConfig.paths.start,
        });

        watcher.on('change', browserSync.reload);
    };

};