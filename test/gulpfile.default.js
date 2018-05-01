const BuildTask = require('../src/BuildTask.js');
const builder = new BuildTask();
builder.setConfig('paths.base', '');
module.exports = builder.createTasks();
