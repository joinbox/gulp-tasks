const glob = require('glob');
const path = require('path');

/**
 * Resolves a glob string or an array of glob strings to the corresponding files or folders and
 * returns these. Needed because webpack doesn't take globs as entry arguments and existing plugins
 * require a work-around syntax.
 * @param  {String|String[]} paths       Glob patterns to resolve
 * @param {String[]} basePathComponents  Array of base path components that will be joined together
 *                                       with the glob patterns provided
 * @return {String[]}        resolved files/paths
 */
module.exports = function(globPattern, basePathComponents = []) {

    const globPatternArray = typeof globPattern === 'string' ? [globPattern] : globPattern;
    return globPatternArray.reduce((prev, pattern) => {
        let globPatternWithPath = path.join(...basePathComponents, pattern);
        // Make sure we use the same base path (process.cwd()) as in getPath.js
        if (!path.isAbsolute(globPatternWithPath)) {
            globPatternWithPath = path.join(process.cwd(), globPatternWithPath);
        }
        return [...prev, ...glob.sync(globPatternWithPath)];
    }, []);

};
