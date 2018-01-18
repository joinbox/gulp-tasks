# Intro

Re-usable [Gulp 4](https://github.com/gulpjs/gulp/tree/4.0) tasks for Joinbox projects that cover the following file types:
- scripts 
- styles
- images
- templates

The tasks support:
- cache busting (TBD)
- source maps
- notifications
- minification
- browser sync (TBD)
- [etc.](https://docs.google.com/document/d/17fVNqmN2PVGjidU9FeCPYTgMFJ66z9ZE5jEPlf9TAUQ)

# Getting Started

## Setup

1. Create a new folder
1. Install **gulp** and **gulp-tasks**:
    ```bash
    npm i -D @joinbox/gulp-tasks
    npm i -g gulp
    ```
1. Add a **gulpfile.js** …
    ```bash
    touch gulpfile.js
    ```
1. … and configure your tasks in it:
    ```javascript
    // Require and initialize our builder:
    const GulpTaskBuilder = require('gulp-tasks');
    const builder = new GulpTaskBuilder();
    
    // Add a CSS task and slightly change the configuration (entry point)
    builder.addTask('css', {
        entryPoints: ['main.scss']
    });

    // Add a JS task and change webpack options to support react
    builder.addTask('js');
    // As the react preset should be added to (and not just replace) the current presets,
    // we can't use a configuration object (as seen in the CSS task above)
    builder.getTask('js').addPreset('react');

    // Update config to support older browsers (by polyfilling missing features)
    builder.setConfig('targets', ['last 2 versions', 'ie >= 11']);

    // Get the task object with all tasks you added (builder.addTask)
    const tasks = builder.getTasks();

    // Add a custom task
    // Requires were omitted intentionally to keep the file short
    function twig() {
        return gulp.src('www/src/html/*.html', { base: 'www/src/' })
            .pipe(data(() => {
                return JSON.parse(fs.readFileSync(`www/src/data/de.json`));
            }))
            .pipe(gulpTwig())
            .pipe(rename((path) => {
                path.basename += '-de';
            }))
            .pipe(gulp.dest('www/dist/'))
            .pipe(notify('Twig done'));
    }

    // Add your custom task to the tasks object that will be exported
    tasks.twig = twig;

    // Export tasks in order to run them through gulp
    modules.exports = tasks;
    ```
1. Run your tasks
    ```bash
    gulp
    ```


## Available Tasks

Options and methods: See the corresponding classes (source code)

### General
- `gulp dev`: Calls all available `dev` tasks 
- `gulp watch`: Calls all available `watch` tasks
- `gulp`: Calls all available `dev` and `watch` tasks

### CSS
- `cssDev`: Converts CSS files, then halts
- `cssWatch`: Only watches CSS files (triggers on change)
- `css`: `cssDev` + `cssWatch`
- `cssLive`: Converts and minifies files

### JS
- `jsDev`: Converts CSS files, then halts
- `jsWatch`: Only watches JS files (triggers on change)
- `js`: `jsDev` + `jsWatch`
- `jsLive`: Converts and minifies files

### Twig
…


