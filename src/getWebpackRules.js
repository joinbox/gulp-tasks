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

    rules.push(getEslintRule());

    console.log(colors.yellow('WebpackRules: There are %d rules: %s'), rules.length, 
        JSON.stringify(rules, null, 2));
    return rules;

};


/**
 * Creates an empty defaultRule. 
 * We cannot use JSON.stringify to clone defaultRule, regexes will be converted to empty
 * objects!
 */
function getDefaultRule(browsers) {
    return {
        test: /\.js$/,
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


function getEslintRule() {
    return {
        test: /\.jsx?$/,
        use: {
            loader: 'eslint-loader', 
            // Location of .eslintrc: See webpack config, 
            // https://github.com/webpack-contrib/eslint-loader/commit/
            // cf48c8077ad63e689c56600f0cf2a81107fc8b56
            options: {
                configFile: '../node_modules/@joinbox/eslint-config-joinbox/.eslintrc',
                enforce: 'pre',
                emitWarning: true,
                exclude: /node_modules/,
            }
        }
    }
}