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
1. Install **gulp 4** and **jb-build-tasks**:
    ```bash
    npm i -D @joinbox/jb-build-tasks
    npm i -g gulp@4
    ```
1. Add a **gulpfile.js** …
    ```bash
    touch gulpfile.js
    ```
1. … and configure your tasks in it:
    ```javascript
    // Require and initialize our builder:
    const BuildTasksBuilder = require('jb-build-tasks');
    const builder = new BuildTasksBuilder();

    // Update CSS config: every config is an object; pass the path to the property you desire to
    // change and set its new value.
    builder.setConfig('paths.css.entryPoints', ['main.scss']) // default is 'styles.scss'
    builder.setConfig('supportedBrowsers', ['>1%']);

    // Babel
    const BabelConfigBuilder = require('jb-build-tasks').BabelConfigBuilder;
    const babel = new BabelConfigBuilder();
    babel.setConfig('…', '…');

    // Webpack


    // Add a JS task and change webpack options to support react
    builder.addTask('js', {
        sourcePath: 'javascripts', // default is 'js'
        watch: ['**/*.js?(x)'], // also watch react files; default is ['**/*.js']
    });
    // As the react preset should be added to (and not just replace) the current presets,
    // we can't use a configuration object (as seen in the CSS task above)
    builder.getTask('js').addPreset('react');

    // Update config to support older browsers (by polyfilling missing features)
    builder.setConfig('targets', ['last 2 versions', 'ie >= 11']);

    // Create a custom task
    // (Requires were omitted intentionally to keep the file short)
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

    // Add the custom task to our builder so that it is included in the default gulp task
    builder.addCustomTask(twig, ['default']);

    // Get the task object with all tasks you added (through builder.addTask())
    // and export tasks in order to run them through gulp
    modules.exports = builder.getTasks();
    ```
1. Run your tasks
    ```bash
    gulp
    ```

# Tests

There are a few automated tests, run them with `npm test`. To test the implementation, call the gulp
files in the `test` folder: 

```bash
cd test && gulp -f gulpfile.default.js
```

## Available Tasks

The following tasks are available by default. Options and methods: See the corresponding classes (source code)

### General
- `gulp dev`: Calls all available `dev` tasks (they execute once)
- `gulp watch`: Calls all available `watch` tasks (they are executed continuously on change)
- `gulp`: Calls all available `dev` and `watch` tasks

Default options are: 
```javascript
{
    paths: {
        base: './www',
        source: 'src', // This is where your source files are
        destination: 'dist', // This is where your dist files go
    }
}
```

### JS
- `jsDev`: Converts CSS files, then halts
- `jsWatch`: Only watches JS files (triggers on change)
- `js`: `jsDev` + `jsWatch`
- `jsLive`: Converts and minifies files

Default options are: 
```javascript
{
    
}
```

### CSS
- `cssDev`: Converts CSS files, then halts
- `cssWatch`: Only watches CSS files (triggers on change)
- `css`: `cssDev` + `cssWatch`
- `cssLive`: Converts and minifies files

### Twig
…


