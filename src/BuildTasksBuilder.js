const defaultConfig = require('./defaultConfig');
const getProperty = require('./getProperty');
const createScriptTasks = require('./createScriptTasks');
const createStyleTasks = require('./createStyleTasks');
const createTemplateTasks = require('./createTemplateTasks');
const createBrowserSync = require('./createBrowserSync');
const colors = require('colors');

module.exports = class BuildTasksBuilder {

	constructor() {
		this.config = defaultConfig;
	}


	/**
	 * Updates the certain parts of the configuration.
	 * @param {string} path 	Path to the property (of this.config) to modify.
	 * @param {*} value			Value to set property to
	 */
	setConfig(path, value) {
		const property = getProperty(this.config, path);
		property.reference.entity[property.reference.property] = value;
	}

	/**
	 * Creates and returns tasks
	 * @return {[type]} [description]
	 */
	createTasks() {

		// Holds all created tasks. Key: task name (for export), value: task
		let tasks = {};

		if (this.config.scripts) {
			console.log(colors.cyan('BuildTasksBuilder: Create script tasks'));
			const jsDev = createScriptTasks(this.config.scripts, this.config.paths, 
				this.config.supportedBrowsers);
			const jsProd = createScriptTasks(this.config.scripts, this.config.paths, 
				this.config.supportedBrowsers, 'production');
			tasks = { ...this.tasks, jsDev, jsProd };
		}

		if (this.config.styles) {
			console.log(colors.cyan('BuildTasksBuilder: Create style tasks'));
			const cssDev = createStyleTasks(this.config.styles, this.config.paths, 
				this.config.supportedBrowsers);
			// TODO: There's no difference between prod and dev task – should there be?
			const cssProd = createStyleTasks(this.config.styles, this.config.paths, 
				this.config.supportedBrowsers);
			tasks = { ...this.tasks, cssDev, cssProd };
		}

		if (this.config.templates) {
			console.log(colors.cyan('BuildTasksBuilder: Create template tasks'));
			const htmlDev = createTemplateTasks(this.config.templates, this.config.paths);
			const htmlProd = createTemplateTasks(this.config.templates, this.config.paths);
			tasks = { ...this.tasks, htmlDev, htmlProd };
		}

		if (this.config.serve) {
			console.log(colors.cyan('BuildTasksBuilder: Create serve tasks'));
			const serveTasks = createBrowserSync(this.config.templates, this.config.paths);
			tasks = { ...this.tasks, ...serveTasks };
		}

		console.log(colors.cyan('BuildTasksBuilder: Tasks are %s'), 
			Object.keys(tasks).join(', '));

		return tasks;

	}

};