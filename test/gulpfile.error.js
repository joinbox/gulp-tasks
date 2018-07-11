/**
 * Test error handling
 */

const BuildTask = require('../src/BuildTask.js');

const builder = new BuildTask();
builder.setConfig('paths.base', '');
// Invalid JS file
builder.setConfig('scripts.paths.entries', ['**/errorFile.js']);
// Invalid CSS file
builder.setConfig('styles.paths.entries', ['**/*.iscss']);
module.exports = builder.createTasks();
