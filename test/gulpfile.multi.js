/**
 * Test multiple entry points
 */

const BuildTask = require('../src/BuildTask.js');

const builder = new BuildTask();
builder.setConfig('paths.base', '');
builder.setConfig('scripts.paths.entries', ['**/!(errorFile).js']);
builder.setConfig('styles.paths.entries', ['**/main.scss', '**/otherFile.scss']);

module.exports = builder.createTasks();
