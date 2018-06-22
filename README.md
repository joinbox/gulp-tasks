# Intro

Re-usable [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0) tasks for Joinbox projects that cover 
the following file types:
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
- `gulp`: First clears your destination directory, then calls `dev`, then `watch`and then starts up 
    a browserSync webserver
- `gulp prod`: Clears destination, then creates production files
- `gulp serve`: Just boots up and runs the server; changes won't be watched (as no watch tasks are
    started)
- `gulp clean`: Removes the destination folder

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



# Settings

See [default settings](blob/master/src/defaultConfig.js). Can be changed with `setConfig` (see 
below).



# Setup

1. Create a new folder

1. Install **gulp 4** and **build-task** locally, gulp-cli globally:
    ```bash
    npm i -D @joinbox/build-task gulp@4
    npm i -g gulpjs/gulp-cli
    ```

1. Add a **gulpfile.js** …
    ```bash
    touch gulpfile.js
    ```

1. Either use the default config …
    ```javascript
    const BuildTask = require('@joinbox/build-task');
    const builder = new BuildTask();
    module.exports = builder.createTasks();
    ```

1. … or adjust it to match your own setup:
    ```javascript
    // Require and initialize our builder:
    const BuildTask = require('@joinbox/build-task');
    const builder = new BuildTask();

    // Update/change config. The configuration is an object; pass the path to the 
    // property you desire to change and set its new value. See src/defaultConfig
    // for defaults.
    builder.setConfig('paths.css.entryPoints', ['styles.scss']);
    builder.setConfig('paths.js.technologies', ['react']); 
    builder.setConfig('supportedBrowsers', ['>1%']);
    // Don't export the server gulp task; when calling gulp's default task, it won't 
    // start either
    builder.setConfig('server', false);

    // Create a custom task
    // imgDev copies images to destination directory
    // imgWatch watches changes on images and copies them to destination directory
    const imageSources = 'www/src/**/*.png';
    function imgDev() {
        return gulp.src(imageSources)
            .pipe(gulp.dest('www/dist'));
    }
    function imgWatch() {
        return gulp.watch(imageSources, imgDev);
    }

    // Add your tasks to builder.tasks: they will become part of the object returned by 
    // createTasks(). builder.tasks is a Map; the key is the tasks's name, the value the 
    // corresponding function. 
    // Your functions cann now be invoked by calling gulp imgWatch or gulp imgDev
    builder.tasks.set('imgWatch', imgWatch);
    builder.tasks.set('imgDev', imgDev);

    // Add your task to builder.devTasks and builder.watchTasks; this will call them 
    // within the default gulp task. devTasks and watchTasks are arrays.
    builder.devTasks.push(imgDev);
    builder.watchTasks.push(imgWatch);

    // Export tasks to expose them to gulp
    module.exports = builder.createTasks();
    ```

1. Run your tasks
    
    As you added your own `imgWatch` and `imgDev` functions to the gulp task, they will now be part
    of the default gulp task and therefore be invoked when executing:

    ```bash
    gulp
    ```



# Tests

There are a few automated tests, run them with `npm test`. To test the implementation, call the gulp
files in the `test` folder: 

```bash
cd test && gulp -f gulpfile.default.js
```

