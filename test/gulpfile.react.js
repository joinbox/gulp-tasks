/**
 * Test react:
 * - JSX
 * - MobX: stage 2 (class properties and decorators)
 */

const BuildTask = require('../src/BuildTask.js');

const builder = new BuildTask();
builder.setConfig('paths.base', '');
builder.setConfig('scripts.technologies', ['react']);
builder.setConfig('scripts.paths.entries', ['**/react.jsx']);
builder.setConfig('server', false);
builder.createTasks();

module.exports = builder.createTasks();
