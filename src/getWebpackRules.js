const colors = require('colors');

module.exports = function(technologies, browsers) {

    const rules = [];





    // Default tech
    if (technologies.includes('default')) {
        console.log(colors.yellow('Webpack: Use default technologies'));
        rules.push(getDefaultRule(browsers));
    }


    // React
    if (technologies.includes('react')) {
        console.log(colors.yellow('Webpack: Use react'));
        // Clone default rule before modifying it
        const reactRule = getDefaultRule(browsers);
        reactRule.test = /.*\.jsx?$/,
        reactRule.use.options.presets.push('@babel/react');
        rules.push(reactRule);
    }

    console.log(colors.yellow('WebpackRules: There are %d rules'), rules.length);
    return rules;

};


/**
 * Creates an empty defaultRule. 
 * We cannot use JSON.stringify to clone defaultRule, regexes will be converted to empty
 * objects!
 */
function getDefaultRule(browsers) {
    return {
        test: /.*\.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env', {
                            targets: browsers,
                        },
                    ],
                ],
                babelrc: false,
                cacheDirectory: true,
            },                      
        }
    };
}