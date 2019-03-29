const path = require('path');
const BuildTask = require('../src/BuildTask.js');

const builder = new BuildTask();

builder.setConfig('server', false);
builder.setConfig('templates', false);
builder.setConfig('styles', false);

// Test config from SBC project that failed
builder.setConfig('paths.base', '');
builder.setConfig('paths.source', '');

// Test absolute destination path
builder.setConfig('paths.destination', path.join(__dirname, 'dist'));
builder.setConfig('scripts.paths.destination', 'js');

// Test absolute entries
builder.setConfig('scripts.paths.source', '');
builder.setConfig('scripts.paths.entries', [
    path.join(__dirname, 'src/js/main.js'),
    path.join(__dirname, 'src/js/otherFile.js'),
]);

module.exports = builder.createTasks();
