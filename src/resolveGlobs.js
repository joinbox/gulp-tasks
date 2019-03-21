const glob = require('glob');
const path = require('path');

/**
 * Resolves a glob string or an array of glob strings to the corresponding files or folders and
 * returns these. Needed because webpack doesn't take globs as entry arguments and existing plugins
 * require a work-around syntax.
 * @param  {String|String[]} paths      Glob patterns to resolve
 * @param {String} basePath             Base path wherein the glob pattern will search
 * @return {String[]}        resolved files/paths
 */
module.exports = function(globPattern, basePath = '') {

    const globPatternArray = typeof globPattern === 'string' ? [globPattern] : globPattern;
    return globPatternArray.reduce((prev, pattern) => {
        const globPatternWithPath = path.join(basePath, pattern);
        return [...prev, ...glob.sync(globPatternWithPath)];
    }, []);

};
