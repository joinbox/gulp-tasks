const path = require('path');
module.exports = function(paths, typeConfig) {
	if (paths.base === undefined || paths.source === undefined || typeConfig.base === undefined || 
		typeConfig.entries === undefined) {
		throw new Error(`getSources: Properties missing on paths ${ JSON.stringify(paths) } and
			${ JSON.stringify(typeConfig) }.`);
	}
	const entries = Array.isArray(typeConfig.entries) ? typeConfig.entries : [typeConfig.entries];
	return entries.map((entry) => path.join(paths.base, paths.source, typeConfig.base, entry));
};