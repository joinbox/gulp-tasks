const path = require('path');
const getPath = require('./getPath');
const colors = require('colors');

/**
 * Create server
 * @param  {object} serverConfig    Config for server
 * @param  {paths} paths            Config for paths
 * @param  {EventEmitter} watcher   Event emitter that emits events on change (js, css, html files
 *                                  etc.)
 * @param {object} browserSyncInstance Shared instance of browserSync that is used across all
 *                                  our functions
 */
module.exports = function createBrowserSync(serverConfig, paths, watcher, browserSyncInstance) {

    // Path where files are served from
    const htmlDestPath = getPath(paths, serverConfig.paths);
    // Path to watch – reload browserSyncInstance on changes
    const watchPath = path.join(htmlDestPath, serverConfig.paths.watch);

    console.log(colors.blue('Serve: Serving from %s, watching %s'), htmlDestPath, watchPath);

    return function() {
        browserSyncInstance.init({
            server: path.join(paths.base, paths.destination),
            startPath: serverConfig.paths.start,
        });

        watcher.on('change', browserSyncInstance.reload);
    };

};
