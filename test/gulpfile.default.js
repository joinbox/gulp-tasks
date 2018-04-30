const BuildTasksBuilder = require('../src/BuildTasksBuilder.js');
const builder = new BuildTasksBuilder();
builder.setConfig('paths.base', '');

builder.createTasks();

module.exports = builder.tasks;