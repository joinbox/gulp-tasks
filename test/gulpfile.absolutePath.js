const path = require('path');
const BuildTask = require('../src/BuildTask.js');

// Main JS entry file is main.js
const builder = new BuildTask();
builder.setConfig('paths.base', path.join(process.cwd()));
module.exports = builder.createTasks();
