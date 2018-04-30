/**
 * Gets a property from an object by using a path to get there. Returns the value and the property 
 * itself (to e.g. update strings which are not referenced).
 * @param  {object} object Object to search
 * @param  {strig} path    Path to get on object, e.g. address.name or address.phoneNumbers.5 (for
 *                         arrays)
 * @return {object}        Object with properties reference (parent field of current value) and 
 *                         value (for the value)
 */
module.exports = function(object, path) {
	const slices = path.split('.');
	let currentObject = object;
	let parentObject; // Defaults to undefined
	slices.reduce((prev, slice) => {
		if (!currentObject[slice]) throw new Error(`getProperty: Property for path ${ prev } not
			found in object ${ JSON.stringify(object) }, full path is ${ path }.`);
		parentObject = currentObject;
		currentObject = currentObject[slice];
		return prev + '.' + slice;
	}, '');
	return {
		reference: {
			entity: parentObject,
			property: slices.pop(),
		},
		value: currentObject,
	};
};