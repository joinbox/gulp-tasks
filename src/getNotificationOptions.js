const colors = require('colors');

/**
 * Generates the config for notifications
 * @param  {string} type            'Scripts' or 'styles' (or others)
 * @param  {string|object} error    Error object or a string; if it's an error object, an error
 *                                  message will be displayed
 */
module.exports = function(type, content) {

    console.log(colors.grey('getNotifyOptions for %s, error %o'), type, content instanceof Error);
    
    let title, text;
    if (content instanceof Error && content.name === 'LintError') {
        title = `${ type } did not pass lint 🚑`;
        text = content.message;
    }
    else if (content instanceof Error) {
        title = `${ type } failed 😈`;
        text = content.message;
    }
    else {
        title = `${ type } done 🚀`;
        text = `${ type } successfully compiled${ content ? ': ' + content : '' }.`;
    }
    
    console.log(colors.grey(`getNotifyOptions: title ${ title }, text ${ text }.`));
    
    return {
        // Only one notification per task, not per stream
        onLast: true, //error ? false : true,
        title: title,
        message: text,
    };
    
};