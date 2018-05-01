const BuildTask = require('../src/BuildTask.js');
const builder = new BuildTask();
builder.setConfig('paths.base', '');
builder.setConfig('scripts.technologies', ['react']);
builder.setConfig('scripts.paths.entries', ['**/react.jsx']);
builder.createTasks();

module.exports = builder.createTasks();
