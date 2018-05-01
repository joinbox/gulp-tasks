const colors = require('colors');
const del = require('del');

module.exports = function(path) {
	console.log(colors.grey('Remove %s'), path);
	return (done) => del(path).then((paths) => {
		console.log(colors.grey('Removed paths %s'), paths.join('\n'));
		done();
	});
};