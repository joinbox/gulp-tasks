const BuildTasksBuilder = require('../src/BuildTasksBuilder.js');
const builder = new BuildTasksBuilder();
builder.setConfig('paths.base', '');
builder.setConfig('scripts.paths.entries', ['**/errorFile.js']);

builder.createTasks();

module.exports = builder.tasks;