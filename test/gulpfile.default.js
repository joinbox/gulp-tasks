const BuildTasksBuilder = require('../src/BuildTasksBuilder.js');
const builder = new BuildTasksBuilder();
builder.setConfig('paths.base', '');

builder.createTasks();

console.log('Builder tasks: %o', builder.tasks);

module.exports = builder.tasks;