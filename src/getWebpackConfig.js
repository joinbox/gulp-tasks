const glob = require('glob');
const path = require('path');
const colors = require('colors');
const getWebpackRules = require('./getWebpackRules');
const getPath = require('./getPath');

/**
 * Create webpack configuration object for options passed in
 * @param  {[type]} jsConfig [description]
 * @param  {[type]} browsers [description]
 * @param  {String} mode     [description]
 * @return {[type]}          [description]
 */
module.exports = function(jsConfig, pathConfig, browsers, mode = 'development') {


    console.log(colors.yellow('Webpack: Create config; jsConfig is \n%s\npathConfig is \n%s'), 
        JSON.stringify(jsConfig, null, 2), JSON.stringify(pathConfig, null, 2));



    // Get paths; make sure you're running gulp from the directory where your gulp file lies
    const baseSourcePath = getPath(pathConfig, jsConfig.paths);
    const baseDestinationPath = getPath(pathConfig, jsConfig.paths, 'destination');
    console.log(colors.yellow('Webpack: baseSourcePath is %s, baseDestinationPath is %s'), 
        baseSourcePath, baseDestinationPath);



    // Allow globs as entry points – and also (and especially) arrays of globs. Webpack does not
    // support it, do it manually: https://github.com/webpack/webpack/issues/370
    const entries = jsConfig.paths.entries
        // 1. Resolve all array's items globs to files
        .reduce((prev, source) => {
            const sourceWithPath = path.join(baseSourcePath, source);
            console.log(colors.yellow('Webpack: Get files for %s from glob %s'), source, 
                sourceWithPath);
            return [...prev, ...glob.sync(sourceWithPath)];
        }, [])
        // 2. Make all paths absolute if it is not already
        .map((item) => path.isAbsolute(item) ? item : path.join(baseSourcePath, item))
        // 3. Now make an object out of our files (if we pass an array as entry point, webpack will
        //    create just one file, main.js). The object's key is the relative path from 
        //    baseSourcePath
        .reduce((prev, item) => {
            // Relative path is the difference from baseSourcePath to item and therefore
            // also the difference where we want to store the file relative to baseDestinationPath
            const relativePath = path.relative(baseSourcePath, item);
            // Remove the extension which will be added when saving – if we don't we'll have two
            // extensions
            const extension = path.extname(relativePath);
            const relativePathWithoutExtension = relativePath.substr(0, relativePath.length - 
                extension.length);
            return {...prev, ...{ [relativePathWithoutExtension]: item} };
        }, {});

    console.log(colors.yellow('Webpack: Sources are %s'), Object.values(entries).join(', '));





    const webpackConfig = {
        mode: mode,
        
        entry: entries,
        output: {
            filename: jsConfig.paths.output,
            // Don't use __dirname as it resolves to the node's base directory (where 
            // package.json lies)
            path: baseDestinationPath,
        },
        devtool: 'source-map',
        module: {
            rules: getWebpackRules(jsConfig.technologies, browsers)
        }
    };





    console.log(colors.yellow('Webpack: Final config is \n%s'), 
        JSON.stringify(webpackConfig, null, 2));

    return webpackConfig;

};