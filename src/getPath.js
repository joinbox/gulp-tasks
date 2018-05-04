const path = require('path');
//const colors = require('colors');

/**
 * Returns the path to a source ord destination
 * @param  {object} paths      Object of paths, must contain base, source and destination
 * @param  {object} typeConfig Paths config for the current type, must contain source and 
 *                             destination
 * @param  {String} type       'source' or 'destination'
 * @return {string}
 */
module.exports = function(paths, typeConfig, type = 'source') {
    //console.log(colors.grey('Get paths for %o %o and type %s'), paths, typeConfig, type);
    if (paths.base === undefined) throw new Error(`getSources: base property missing on paths
        ${ JSON.stringify(paths) }`);
    if (paths[type] === undefined) throw new Error(`getSources: ${ type } property missing on 
        paths ${ JSON.stringify(paths) }`);
    if (!typeConfig[type] === undefined) throw new Error(`getSources: ${ type } property missing on 
        type config ${ JSON.stringify(typeConfig) }`);
    return path.join(process.cwd(), paths.base, paths[type], typeConfig[type]);
};