const test = require('ava');
const path = require('path');
const resolveGlobs = require('./resolveGlobs');

test('resolves globs from string', (t) => {
    const result = resolveGlobs('**/*.js', [__dirname, '../test/src']);
    t.is(result.length, 5);
});

test('works without basePath', (t) => {
    const globWithBase = path.join(__dirname, '../test/src', '**/*.js');
    const result = resolveGlobs(globWithBase);
    t.is(result.length, 5);
});

test('resolves globs from array', (t) => {
    const globs = ['**/m*.js', '**/o*.js'];
    const result = resolveGlobs(globs, [__dirname, '../test/src']);
    t.is(result.length, 3);
});

test('returns empty array if no match is found', (t) => {
    const globs = ['**/completely-invalid-file-path.jbx'];
    const result = resolveGlobs(globs, [__dirname, '../test/src']);
    t.deepEqual(result, []);
});
