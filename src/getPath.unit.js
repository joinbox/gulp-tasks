const test = require('ava');
const path = require('path');
const getPath = require('./getPath');

test('throws if data is missing', (t) => {
    t.throws(() => getPath({}), /base property/);
    t.throws(() => getPath({ base: '' }), /source property missing on paths/);
    t.throws(() => getPath({ base: '', source: '' }, {}), /source property missing on type config/);
});

test('correctly resolves relative path', (t) => {
    const resolved = getPath(
        {
            base: '../test',
            source: 'src',
        },
        {
            source: 'js',
        },
    );
    t.is(resolved, path.join(process.cwd(), '../test/src/js'));
});

test('correctly resolves absolute base path', (t) => {
    const resolved = getPath(
        {
            base: process.cwd(),
            source: '../test/src',
        },
        {
            source: 'js',
        },
    );
    t.is(resolved, path.join(process.cwd(), '../test/src/js'));
});

test('correctly resolves to type provided', (t) => {
    const resolved = getPath(
        {
            base: process.cwd(),
            myType: '../test/src',
        },
        {
            myType: 'js',
        },
        'myType',
    );
    t.is(resolved, path.join(process.cwd(), '../test/src/js'));
});

test('correctly resolves absolute non-base paths', (t) => {
    const resolved = getPath(
        {
            base: '', // Make sure not the base path is absolute for this test case
            myType: path.join(process.cwd(), '../test/src'),
        },
        {
            myType: 'js',
        },
        'myType',
    );
    t.is(resolved, path.join(process.cwd(), '../test/src/js'));
});
