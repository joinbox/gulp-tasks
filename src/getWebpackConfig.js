const path = require('path');
const colors = require('colors');
const resolveGlobs = require('./resolveGlobs.js');
const getWebpackRules = require('./getWebpackRules.js');
const getPath = require('./getPath.js');

/**
 * Create webpack configuration object for options passed in
 * @param  {[type]} jsConfig [description]
 * @param  {[type]} browsers [description]
 * @param  {String} mode     [description]
 * @return {[type]}          [description]
 */
module.exports = function(jsConfig, pathConfig, browsers, mode = 'development') {


    console.log(
        colors.yellow('Webpack: Create config; jsConfig is \n%s\npathConfig is \n%s'),
        JSON.stringify(jsConfig, null, 2),
        JSON.stringify(pathConfig, null, 2),
    );



    const baseDestinationPath = getPath(pathConfig, jsConfig.paths, 'destination');

    // Make sure we only join paths together *after* entry points are known, as entries may be
    // absolute.
    const baseSourceComponents = [pathConfig.base, pathConfig.source, jsConfig.paths.source];

    console.log(
        colors.yellow('Webpack: baseSourcePath is %s, baseDestinationPath is %s'),
        baseSourceComponents,
        baseDestinationPath,
    );

    // If entries is an array, create one file; if it's an object, use named chunks, see
    // https://webpack.js.org/configuration/entry-context#naming
    let entries;
    const configEntries = jsConfig.paths.entries;

    // Entries is a string or array: resolve globs to corresponding files
    if (Array.isArray(configEntries) || typeof configEntries === 'string') {
        entries = resolveGlobs(configEntries, baseSourceComponents);
    }
    // Entries is an object: Resolve object's values to files, keep keys intact
    else if (configEntries !== null && typeof configEntries === 'object') {
        entries = Object.keys(configEntries).reduce((prev, key) => {
            prev[key] = resolveGlobs(configEntries[key], baseSourceComponents);
            return prev;
        }, {});
    }
    // Entries are invalid
    else {
        throw new Error(`path.entries of jsConfig must be an Array, String or Object, you passed ${configEntries}`);
    }

    console.log(colors.yellow(`Webpack: entries were ${JSON.stringify(configEntries)}, are now ${JSON.stringify(entries)}`));




    const webpackConfig = {
        mode,
        // Resolve babel-loader, eslint-loader etc. to node_modules directory of
        // @joinbox/build-task, not the main project's node_modules directory where the required
        // dependencies will be missing.
        // ATTENTION: This is only needed when linking to this package, not when installing it.
        /* resolveLoader: {
            modules: [path.resolve(__dirname, '../node_modules')],
        }, */
        entry: entries,
        output: {
            filename: jsConfig.paths.output,
            // Don't use __dirname as it resolves to the node's base directory (where
            // package.json lies)
            path: baseDestinationPath,
        },
        devtool: 'source-map',
        module: {
            rules: getWebpackRules(jsConfig.technologies, browsers),
        },
        // Without this line, jsx files must be imported with their suffix (import a from 'a.jsx').
        // Asterisk (*) is needed to still allow imports with extension, see
        // https://webpack.js.org/configuration/resolve/
        resolve: {
            extensions: ['.js', '.jsx', '.mjs', '*'],
        },
    };



    console.log(
        colors.yellow('Webpack: Final config is \n%s'),
        JSON.stringify(webpackConfig, null, 2),
    );

    return webpackConfig;

};

