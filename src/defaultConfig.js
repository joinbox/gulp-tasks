/**
 * Config that serves as a default for the build task.
 */

const defaults = {
    paths: {
        base: 'www',
        source: 'src',
        destination: 'dist',
        destination_dev: 'dist_dev',
        public: '', // Directory to serve files from
    },
    // Use false to not expose scripts task
    scripts: {
        // use ['default'] or ['react'] (not both, react includes default)
        // TODO: add config options (e.g. for eslint file), maybe solve through nested arrays with
        // [['eslint', { filePath: path.resolve('test', 'eslintrc') }]]
        technologies: ['default', 'eslint'],
        paths: {
            source: 'js',
            watch: '**/*.js?(x)',
            destination: 'js',
            // If you use an array, all files will be concatenated into one single file. If you use
            // an object, one output file will be generated per property, see
            // https://webpack.js.org/configuration/entry-context#naming
            entries: ['main.js'],
            output: '[name].js',
        },
    },
    // Use false to not expose styles task
    styles: {
        paths: {
            source: 'css',
            destination: 'css',
            watch: '**/*.scss',
            entries: ['main.scss'],
        },
    },
    // Use false to not template scripts
    templates: {
        paths: {
            source: 'html',
            watch: '**/*.html',
            destination: 'html',
            entries: ['**/*.html'],
        },
    },
    production: {
        bustCache: false, // TBD
    },
    // False to not add it to tasks
    server: {
        paths: {
            source: 'html',
            watch: '**/*.html',
            start: 'html', // Where to point to
        },
    },
    // Browser applies to CSS prefixing and JS babel compilation, see
    // https://github.com/browserslist/browserslist#queries
    supportedBrowsers: [
        '>1%',
    ],
};

module.exports = defaults;
