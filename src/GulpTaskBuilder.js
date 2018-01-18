const JsTasks = require('./JsTasks');

/**
* Builds tasks according to configuration. Until getTasks() is called, only the configurations
* are updated (on task or general). Only when getTasks() is invoked, the Gulp task functions will
* be generated.
*/
class GulpTaskBuilder {

	constructor() {
		// Stores added tasks
		this.tasks = new Map();
		// Stores general (non task specific) configuration
		this.generalConfiguration = new Map();
		this.taskMapping = new Map();
		this.taskMapping.set('js', JsTasks);
	}
	
	/**
	* Adds a task to the list of tasks that will be returned
	* @param {string} name 				Name of task to add
	* @param {object} configuration		Configuration to initialize task with
	*/
	addTask(name, configuration) {
		if (this.tasks.has(name)) throw new Error(`You're adding a task that does already exist
			${ name }).`);
		if (!this.taskMapping.has(name)) throw new Error(`Unknown task type ${ name }.`);
		this.tasks.set(name, new this.taskMapping.get(name)(configuration));
	}

	/**
	* Returns a single task that was previously added
	* @param {string} name
	* @returns {object}
	*/
	getTask(name) {
		return this.tasks.get(name);
	}

	/**
	* Sets the general configuration options
	* @param {string} property		Property to set
	* @param {object} value
	*/
	setConfiguration(property, value) {
		this.generalConfiguration.set(property, value);
	}

	/**
	* @param {function} 	taskFunction
	* @param {array|string}	includeInTasks		Name of tasks to include task in, e.g. 'default'
	*											or ['default', 'watch']
	*/ 
	addCustomTask(taskFunction, includeInTasks) {

	}

	/**
	* Builds and returns the task
	* Make sure to include watch, dev and default !!!!!
	* @returns {object}		Object with Gulp task name (key) and gulp function (value)
	*/
	getTasks() {
		const tasks = {};
		this.tasks.forEach((task) => {
			// tasks is an array of functions
			const taskFunctions = task.generateTasks();
			taskFunctions.forEach((taskFunction) => {
				tasks[taskFunction.name] = taskFunction;
			});
		});
		return tasks;
	}

}

module.exports = GulpTaskBuilder;
