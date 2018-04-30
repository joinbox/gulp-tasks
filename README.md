# Intro

Re-usable [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0) tasks for Joinbox projects that cover the following file types:
- scripts 
- styles
- templates
- images (TBD)

The tasks support:
- source maps
- notifications
- minification
- browser sync
- cache busting (TBD)
- [etc.](https://docs.google.com/document/d/17fVNqmN2PVGjidU9FeCPYTgMFJ66z9ZE5jEPlf9TAUQ)



# Available Tasks

BuildTaskBuilder exposes the following tasks when using the default config:

### General
- `gulp dev`: Clears destination, calls all available `dev` tasks, then halts
- `gulp watch`: Calls all available `watch` tasks
- `gulp`: First calls `dev`, then `watch`and then startsup a browserSync webserver
- `gulp prod`: Clears destination, then creates live files

### JS
- `jsDev`: Clears JS folder in destination, converts JS files, then halts
- `jsWatch`: Only watches JS files (triggers on change)
- `js`: `jsDev` then `jsWatch`
- `jsProd`: Clears JS folder in destination, converts and minifies files for production

### CSS
- `cssDev`: Clears CSS folder in destination, converts css files, then halts
- `cssWatch`: Only watches CSS files (triggers on change)
- `css`: `cssDev` then `cssWatch`
- `cssProd`: Clears CSS folder in destination, converts and minifies files for production

### HTML
- `htmlDev`: Clears HTML folder in destination, copies all HTML files
- `htmlWatch`: Only watches HTML files (triggers on change)
- `html`: `htmlDev` then `htmlWatch`
- `htmlProd`: Clears HTML folder in destination, converts and minifies files for production




# Setup

1. Create a new folder

1. Install **gulp 4** and **jb-build-tasks**:
    ```bash
    npm i -D @joinbox/build-tasks gulp@4
    npm i -g gulpjs/gulp-cli
    ```

1. Add a **gulpfile.js** …
    ```bash
    touch gulpfile.js
    ```

1. … and configure your tasks in it:
    ```javascript
    // Require and initialize our builder:
    const BuildTasksBuilder = require('@joinbox/build-tasks');
    const builder = new BuildTasksBuilder();

    // Update CSS config: every config is an object; pass the path to the property you desire to
    // change and set its new value. See src/defaultConfig for defaults. All properties can be
    // changed by providing the path to the corresponding property and the new value.
    builder.setConfig('paths.css.entryPoints', ['styles.scss']);
    builder.setConfig('paths.js.technologies', ['react']); 
    builder.setConfig('supportedBrowsers', ['>1%']);

    // Get tasks (create them from the config we passed in)
    const tasks = builder.createTasks();

    // Create a custom task
    const imageSources = 'www/src/**/*.png';
    function imgDev() {
        return gulp.src(imageSources)
            .pipe(gulp.dest('www/dist/'));
    }

    // Append our task to the existing dev task
    const originalDevTask = tasks.dev;
    tasks.dev = gulp.parallel(
        originalDevTask, 
        imgDev, 
        gulp.watch(imageSources, imgDev),
    );

    // Export tasks to expose them to gulp
    module.exports = tasks;
    ```

1. Run your tasks
    ```bash
    gulp dev
    ```



# Tests

There are a few automated tests, run them with `npm test`. To test the implementation, call the gulp
files in the `test` folder: 

```bash
cd test && gulp -f gulpfile.default.js
```

