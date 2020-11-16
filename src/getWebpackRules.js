/* global require */
const colors = require('colors');

/**
 * Creates an empty defaultRule.
 * We cannot use JSON.stringify to clone defaultRule, regexes will be converted to empty
 * objects!
 */
function getDefaultRule(browsers) {
    return {
        test: /\.js$/,
        // exclude: [path.resolve(__dirname, 'node_modules')],
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        '@babel/preset-env', {
                            targets: {
                                browsers,
                            },
                        },
                    ],
                ],
                babelrc: false,
                cacheDirectory: true,
                exclude: /core-js/,
            },
        },
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
                configFile: require.resolve('@joinbox/eslint-config-joinbox'),
                // path.join(__dirname, '../node_modules/@joinbox/eslint-config-joinbox/.eslintrc'),
                enforce: 'pre',
                emitWarning: true,
                exclude: /node_modules/,
            },
        },
    };
}

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
        reactRule.test = /.*\.m?jsx?$/;
        reactRule.use.options.plugins = [
            // Legacy decorators: see https://github.com/babel/babel/issues/7786
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
        ];
        reactRule.use.options.presets.push('@babel/preset-react');
        rules.push(reactRule);
    }

    if (technologies.includes('eslint')) {
        rules.push(getEslintRule());
    }

    console.log(
        colors.yellow('WebpackRules: There are %d rules: %s'),
        rules.length,
        JSON.stringify(rules, null, 2),
    );

    return rules;

};

