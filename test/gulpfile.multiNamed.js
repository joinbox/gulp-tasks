/**
 * Test multiple entry points
 */

const BuildTask = require('../src/BuildTask.js');

const builder = new BuildTask();
builder.setConfig('paths.base', '');
// Make sure we test strings and arrays as values
builder.setConfig('scripts.paths.entries', {
    base: '**/!(errorFile).js',
    other: ['otherFile.js'],
});
builder.setConfig('styles', false);

module.exports = builder.createTasks();
