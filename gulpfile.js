const { join } = require('path');
const { buildJavaScript, buildStyles } = require('./src/main.js')
const { watch, parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();


/**
 * Paths
 * Configure your paths here. Use absolute paths via __dirname to simplify things.
 */
const basePath = join(__dirname, 'test');
const paths = {
    scripts: {
        source: join(basePath, 'src/js/main.js'),
        destination: join(basePath, 'dist/js'),
        watch: join(basePath, 'src/js/**/*'),
    },
    browserSync: {
        base: join(basePath, 'dist'),
    },
    styles: {
        source: join(basePath, 'src/sass/main.scss'),
        destination: join(basePath, 'dist/css'),
        watch: join(basePath, 'src/sass/**/*'),
    },
};

/**
* JavaScript
*/
const devScripts = () => (
    buildJavaScript({
        sourcePath: paths.scripts.source,
        destinationPath: paths.scripts.destination,
    })
);

const liveScripts = () => (
    buildJavaScript({
        sourcePath: paths.scripts.source,
        destinationPath: paths.scripts.destination,
        minify: true,
    })
);

/**
* CSS
*/
const devStyles = () => (
    buildStyles({
        sourcePath: paths.styles.source,
        destinationPath: paths.styles.destination,
    })
);

const liveStyles = () => (
    buildStyles({
        sourcePath: paths.styles.source,
        destinationPath: paths.styles.destination,
        minify: true,
    })
);

/**
* BrowserSync
*/
const setupBrowserSync = () => (
    browserSync.init({
        server: {
            baseDir: paths.browserSync.base,
        },
    })
);


/**
* Main Methods
*/
const dev = () => {
    setupBrowserSync();
    watch(
        paths.scripts.watch,
        { ignoreInitial: false },
        series(devScripts, () => browserSync.reload()),
    );
    watch(
        paths.styles.watch,
        { ignoreInitial: false },
        series(devStyles, () => browserSync.stream()),
    );
};

const live = parallel(liveScripts, liveStyles);



/**
* Exports
*/
exports.default = dev;
exports.live = live;
