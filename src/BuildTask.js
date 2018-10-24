const colors = require('colors');
const gulp = require('gulp');
const path = require('path');
const EventEmitter = require('event-emitter');
const getPath = require('./getPath');
const defaultConfig = require('./defaultConfig');
const getProperty = require('./getProperty');
const createScriptTasks = require('./createScriptTasks');
const createStyleTasks = require('./createStyleTasks');
const createTemplateTasks = require('./createTemplateTasks');
const createBrowserSync = require('./createBrowserSync');
const createCleanTasks = require('./createCleanTasks');
// We must use the same browserSync instance across all our files (or it won't reload). Instantiate
// it here and pass it to all components that need it.
const browserSyncInstance = require('browser-sync').create();


module.exports = class BuildTask {

    constructor() {

        // Simple event emitter that can be called when changes happen; serve tasks listens for
        // events and updates on changes
        this.changeWatcher = new EventEmitter();

        // All tasks; key: name, value: function
        this.tasks = new Map();
        // All dev subtasks, will run after cleanup in default task
        this.devTasks = [];
        // All watch subtasks; will run after dev tasks in default task
        this.watchTasks = [];
        // All prod subtasks: Will be called in parallel after clean in 'prod' task
        this.prodTasks = [];

        // Configuratio needed to create tasks
        this.config = defaultConfig;

    }


    /**
     * Updates the certain parts of the configuration.
     * @param {string} path     Path to the property (of this.config) to modify.
     * @param {*} value         Value to set property to
     */
    setConfig(path, value) {
        const property = getProperty(this.config, path);
        property.reference.entity[property.reference.property] = value;
    }


    /**
     * Main methiod: Creates and returns the built tasks
     * @return {[type]} [description]
     */
    createTasks() {

        // BrowserSync must be initialized before it can be updated
        this.createServeTask();
        this.createScriptTasks();
        this.createStyleTasks();
        this.createTemplateTasks();
        this.createCleanTask();

        // Create default task (clears destination, calls all dev then watch tasks)
        this.tasks.set('default', gulp.series(
            // Remove dest folder
            this.tasks.get('clean'),
            // Execute all dev tasks (initial dev)
            gulp.parallel(this.devTasks),
            // Execute all watch tasks and serve (don't use serial here, all tasks will run
            // indefinitely)
            gulp.parallel(this.watchTasks.concat(() => {
                this.config.server ? this.tasks.get('serve')() : null;
            })),
        ));

        // Create prod task
        this.tasks.set('prod', gulp.series(
            this.tasks.get('clean'),
            (done) => {
                console.log(colors.cyan('BuildTask: Execute %d prod tasks'), this.prodTasks.length);
                done();
            },
            gulp.parallel(this.prodTasks),
        ));

        // Convert this.tasks (Map) into an object which will then be returned
        const returnObject = {};
        this.tasks.forEach((task, name) => {
            returnObject[name] = task;
        });

        console.log(colors.cyan('BuildTask: Tasks are %s'), 
            Object.keys(returnObject).join(', '));

        return returnObject;

    }


    /**
     * Just emits a change on this.changeWatcher. this.changeWatcher is where our browsersync server
     * listens to and reloads when a 'change' event. Hook your watch tasks in here.
     */
    emitChange() {
        console.log(colors.cyan('BuildTask: Emit change'));
        this.changeWatcher.emit('change');
        return Promise.resolve();
    }


    /**
     * Removes the destination folder
     * @private
     */
    createCleanTask() {
        this.tasks.set('clean', 
            createCleanTasks(path.join(this.config.paths.base, this.config.paths.destination)));
    }


    /**
     * @private
     */
    createScriptTasks() {

        if (!this.config.scripts) return;

        console.log(colors.cyan('BuildTask: Create script tasks'));
        
        const jsDev = createScriptTasks(this.config.scripts, this.config.paths, 
            this.config.supportedBrowsers);
        const jsProd = createScriptTasks(this.config.scripts, this.config.paths, 
            this.config.supportedBrowsers, 'production');
        
        const fullJsDev = gulp.series(
            createCleanTasks(getPath(this.config.paths, this.config.scripts.paths, 'destination')),
            jsDev,
            this.emitChange.bind(this),
        );

        let watchPath = this.getWatchPath(this.config.scripts);
        console.log(colors.cyan('BuildTask: Watch JS files on %s'), watchPath);
        const jsWatch = () => gulp.watch(watchPath, gulp.series(jsDev, this.emitChange.bind(this)));
        
        this.tasks.set('jsDev', fullJsDev);
        this.tasks.set('jsWatch', jsWatch);
        this.tasks.set('jsProd', jsProd);
        this.tasks.set('js', gulp.series(fullJsDev, jsWatch));

        this.watchTasks.push(jsWatch);
        this.devTasks.push(jsDev);
        this.prodTasks.push(jsProd);

        console.log(colors.cyan('BuildTask: Script tasks created'));

    }


    /**
     * Create all style tasks
     * @private
     */
    createStyleTasks() {

        if (!this.config.styles) return;

        console.log(colors.cyan('BuildTask: Create style tasks'));

        const cssDev = createStyleTasks(
            this.config.styles,
            this.config.paths,
            this.config.supportedBrowsers,
            browserSyncInstance,
        );
        const cssProd = createStyleTasks(
            this.config.styles,
            this.config.paths,
            this.config.supportedBrowsers,
            browserSyncInstance,
            'production',
        );

        const fullCssDev = gulp.series(
            createCleanTasks(getPath(this.config.paths, this.config.styles.paths, 'destination')),
            cssDev,
        );

        const watchPath = this.getWatchPath(this.config.styles);
        console.log(colors.cyan('BuildTask: Watch CSS files on %s'), watchPath);
        const cssWatch = () => gulp.watch(watchPath, cssDev);

        this.tasks.set('cssDev', fullCssDev);
        this.tasks.set('cssWatch', cssWatch);
        this.tasks.set('cssProd', cssProd);
        this.tasks.set('css', gulp.series(fullCssDev, cssWatch));

        this.watchTasks.push(cssWatch);
        this.devTasks.push(cssDev);
        this.prodTasks.push(cssProd);

        console.log(colors.cyan('BuildTask: Style tasks created'));

    }


    /**
     * Small helper: Returns a watch path for a config passed in
     * @private
     */
    getWatchPath(typeConfig) {
        let watchPath = getPath(this.config.paths, typeConfig.paths);
        watchPath = path.join(watchPath, typeConfig.paths.watch);
        return watchPath;
    }


    /**
     * @private
     */
    createTemplateTasks() {

        if (!this.config.templates) return;

        console.log(colors.cyan('BuildTask: Create template tasks'));

        // For html files, there's no difference between dev and prod (yet) – we might use 
        // minification one day.
        const htmlDev = createTemplateTasks(this.config.templates, this.config.paths);
        const htmlProd = createTemplateTasks(this.config.templates, this.config.paths, 
            'production');

        const fullHtmlDev = gulp.series(
            createCleanTasks(getPath(this.config.paths, this.config.templates.paths, 'destination')),
            htmlDev,
            this.emitChange.bind(this),
        );

        let watchPath = this.getWatchPath(this.config.templates);
        console.log(colors.cyan('BuildTask: Watch HTML files on %s'), watchPath);
        const htmlWatch = () => gulp.watch(watchPath, gulp.series(
            htmlDev,
            this.emitChange.bind(this),
        ));
        
        this.tasks.set('htmlDev', fullHtmlDev);
        this.tasks.set('htmlWatch', htmlWatch);
        this.tasks.set('htmlProd', htmlProd);
        this.tasks.set('html', gulp.series(fullHtmlDev, htmlWatch));

        this.watchTasks.push(htmlWatch);
        this.devTasks.push(htmlDev);
        this.prodTasks.push(htmlProd);

        console.log(colors.cyan('BuildTask: Template tasks created'));

    }


    /**
     * @private
     */
    createServeTask() {
        if (!this.config.server) return;

        console.log(colors.cyan('BuildTask: Create serve task'));
        const serve = createBrowserSync(
            this.config.server,
            this.config.paths,
            this.changeWatcher,
            browserSyncInstance,
        );
        this.tasks.set('serve', serve);
        console.log(colors.cyan('BuildTask: Serve task created'));

    }


};