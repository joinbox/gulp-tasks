const gulp = require('gulp');
const path = require('path');
const sass = require('gulp-sass');
const notifier = require('node-notifier');
const sassGlob = require('gulp-sass-glob');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const calc = require('postcss-calc');
const plumber = require('gulp-plumber');
const print = require('gulp-print').default;
const colors = require('colors');
const sourcemaps = require('gulp-sourcemaps');

const getNotificationOptions = require('./getNotificationOptions');
const getPath = require('./getPath');

module.exports = function createStyleTasks(
    styleConfig, 
    paths, 
    browsers, 
    environment = 'development'
) {

    const sassOptions = environment === 'development' ? { outputStyle: 'expanded'} : 
        { outputStyle: 'compressed' };
    
    const sourcePath = getPath(paths, styleConfig.paths);
    const sources = styleConfig.paths.entries.map((entry) => path.join(sourcePath, entry));
    const destinationPath = getPath(paths, styleConfig.paths, 'destination');
    console.log(colors.green('Styles: Sources are %s, destination is %s'), sources.join(', '), 
        destinationPath);

    return function() {

        let hasErrored = false;

        return gulp.src(sources)
            .pipe(plumber({
                errorHandler: () => (err) => notifier.notify(getNotificationOptions('Styles', err))
            }))
            .pipe(print())
            .pipe(sourcemaps.init())

            .pipe(sassGlob())
            .pipe(
                sass(sassOptions)
                    // We need to handle Sass compilation errors specifically, they won't be cought
                    // by plumber. Don't use arrow function as scope must be preserved for logError
                    .on('error', function(err) {
                        sass.logError.call(this, err);
                        notifier.notify(getNotificationOptions('Styles', err));
                        hasErrored = true;
                    })
            )

            .pipe(postcss([
                autoprefixer({
                    browsers: browsers
                }),
                pxtorem({
                    propWhiteList: [],
                    rootValue: 16
                }),
                calc
            ]))

            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(destinationPath))
            //.pipe(browsersync.reload({stream: true}))
            //.pipe(browsersyncPatternlab.reload({stream: true}))
            .on('end', () => {
                if (hasErrored) return;
                notifier.notify(getNotificationOptions('Styles'));
            });

    };

};
