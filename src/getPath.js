const path = require('path');
// const colors = require('colors');

/**
 * Returns the path to a source ord destination
 * @param  {object} paths      Object of paths, must contain base, source and destination
 * @param  {object} typeConfig Paths config for the current type, must contain source and
 *                             destination
 * @param  {String} type       'source' or 'destination'
 * @return {string}
 */
module.exports = function(paths, typeConfig, type = 'source') {

    // console.log(colors.grey('Get paths for %o %o and type %s'), paths, typeConfig, type);

    if (paths.base === undefined) {
        throw new Error(`getPath: base property missing on paths ${JSON.stringify(paths)}`);
    }
    if (paths[type] === undefined) {
        throw new Error(`getPath: ${type} property missing on paths ${JSON.stringify(paths)}`);
    }
    if (typeConfig[type] === undefined) {
        throw new Error(`getPath: ${type} property missing on type config ${JSON.stringify(typeConfig)}`);
    }

    const assembledPath = path.join(paths.base, paths[type], typeConfig[type]);

    // Make sure that the path we return is absolute
    const absolutePath = path.isAbsolute(assembledPath) ? assembledPath :
        path.join(process.cwd(), assembledPath);

    return absolutePath;

};
