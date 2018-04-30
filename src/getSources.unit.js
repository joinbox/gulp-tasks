const test = require('ava');
const getSources = require('./getSources');

function setupData() {
	const paths = {
		base: 'www',
		source: 'src',
	};
	const typeConfig = {
		base: 'js',
		entries: ['test.js']
	};
	return { paths, typeConfig };
}

test('generates for single entry', (t) => {
	const { paths, typeConfig } = setupData();
	typeConfig.entries = 'test.js';
	t.deepEqual(getSources(paths, typeConfig), ['www/src/js/test.js']);
});

test('generates for multiple entries', (t) => {
	const { paths, typeConfig } = setupData();
	typeConfig.entries = ['test1.js', 'test2.js'];
	t.deepEqual(getSources(paths, typeConfig), ['www/src/js/test1.js', 'www/src/js/test2.js']);
});