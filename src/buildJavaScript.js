const { babel } = require('@rollup/plugin-babel');
const { src, dest } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-better-rollup');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const notifier = require('node-notifier');
const gulpSize = require('gulp-size');
const plumber = require('gulp-plumber');
const eslint = require('@rollup/plugin-eslint');



const build = ({ sourcePath, destinationPath, minify = false } = {}) => {

    const size = gulpSize({
        showFiles: true,
        pretty: true,
    });

    // Return promise (instead of gulp stream) to be able to test file externally with ava,
    // see https://stackoverflow.com/questions/34188287/how-to-use-async-await-with-gulp-4
    return new Promise((resolve, reject) => {

        src(sourcePath)
            .pipe(plumber({
                errorHandler: (err) => {
                    notifier.notify({
                        title: '🤬 Scripts failed',
                        message: err.message,
                    });
                    console.error(err);
                },
            }))
            .pipe(sourcemaps.init())
            .pipe(rollup({
                plugins: [
                    // Only lint our internal code (before babeling it or resolving node modules)
                    eslint({
                        extends: '@joinbox/joinbox',
                    }),
                    // Rollup does not resolve node_modules by itself – it needs a plugin
                    nodeResolve({
                        browser: true,
                    }),
                    // Some node modules use CJS (instead of native ES6 modules) – we must teach
                    // rollup how to resolve them
                    commonjs(),
                    babel({
                        babelHelpers: 'bundled',
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods',
                        ],
                        exclude: 'node_modules/**',
                        presets: [
                            ['@babel/preset-env', {
                                useBuiltIns: 'usage',
                                targets: {
                                    ie: 11,
                                },
                                corejs: 3,
                            }],
                        ],
                    }),
                    // If environment is not develop, minify JavaScript. Don't do so on dev
                    // environment to improve speed
                    ...(minify ? [terser()] : []),
                ],
            }, {
                format: 'iife',
            }))
            .pipe(size)
            .pipe(sourcemaps.write('./'))
            .pipe(dest(destinationPath))
            .on('end', () => {
                resolve();
                notifier.notify({
                    title: '😅 Scripts done',
                    message: `Total size: ${size.prettySize}`,
                });
            })
            .on('error', reject);

    });
};

module.exports = build;
