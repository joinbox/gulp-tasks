const BuildTask = require('../src/BuildTask.js');

// Main JS entry file is main.js
const builder = new BuildTask();
builder.setConfig('paths.base', '');
module.exports = builder.createTasks();
