const gulp = require('gulp');
// Use Dart Sass as compiler: It's Sass' default implementation and works with newer versions
// of node that node-sass
const sass = require('gulp-sass')(require('sass'));
const notifier = require('node-notifier');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const gulpSize = require('gulp-size');

const buildStyles = ({
    sourcePath,
    destinationPath,
    minify = false,
    supportedBrowsers = [],
} = {}) => {

    const sassOptions = {
        outputStyle: minify ? 'compressed' : 'expanded',
    };
    const size = gulpSize({
        showFiles: true,
        pretty: true,
    });
    let didFail = false;

    return new Promise((resolve, reject) => {
        gulp.src(sourcePath)
            .pipe(plumber({
                errorHandler: (err) => {
                    notifier.notify({
                        title: '🤬 Styles failed',
                        message: err.message,
                    });
                    console.error(err);
                },
            }))
            .pipe(sourcemaps.init())
            .pipe(sassGlob())
            // If gulp-sass errors, queue continues and will display success message at the end;
            // therefore we have to handle those errors explicitly
            // Use regular function as logError needs scope ('this')
            // It seems that with Dart Sass, sync rendering is (much) faster than async; see
            // https://www.npmjs.com/package/gulp-sass
            // eslint-disable-next-line prefer-arrow-callback
            .pipe(sass.sync(sassOptions).on('error', function(err) {
                sass.logError.call(this, err);
                didFail = true;
            }))
            .pipe(postcss([
                autoprefixer({
                    overrideBrowserslist: supportedBrowsers,
                }),
            ]))
            // .pipe(minify ? cleanCSS() : () => {})
            .pipe(size)
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(destinationPath))
            .on('end', () => {

                // If gulp-sass failed, fail here too
                if (didFail) reject();
                else {
                    notifier.notify({
                        title: '😅 Styles done',
                        message: `Total size: ${size.prettySize}`,
                    });
                    resolve();
                }
            })
            .on('error', (err) => {
                console.error(err);
                reject(err);
            });

    });

};

module.exports = buildStyles;
