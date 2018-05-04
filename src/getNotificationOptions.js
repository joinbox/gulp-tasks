const colors = require('colors');

/**
 * Generates the config for notifications
 * @param  {string} type            'Scripts' or 'styles' (or others)
 * @param  {string|object} error    Error object or a string; if it's an error object, an error
 *                                  message will be displayed
 */
module.exports = function(type, content) {
    console.log(colors.grey('getNotifyOptions for %s, error %o'), type, content instanceof Error);
    
    const title = content instanceof Error ? `${ type } failed 😈` : `${ type } done 🚀`;
    const text = content instanceof Error ? 
        content.message : 
        `${ type } successfully compiled${ content ? ': ' + content : '' }.`;
    
    console.log(colors.grey(`getNotifyOptions: title ${ title }, text ${ text }.`));
    
    return {
        // Only one notification per task, not per stream
        onLast: true, //error ? false : true,
        title: title,
        message: text,
    };
    
};