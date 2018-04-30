const test = require('ava');
const getProperty = require('./getProperty');

function setupData() {
	const object1 = {
		name: 'joinbox',
		address: {
			street: 'brückfeld'
		},
		phones: {
			mobile: [
				'1234',
				'4321',
			],
		},
	};
	return { object1 };
}

test('throws on wrong path', (t) => {
	const { object1 } = setupData();
	t.throws(() => getProperty(object1, 'name.subvalue'), /for path/);
});

test('finds valid object paths', (t) => {
	const { object1 } = setupData();
	t.deepEqual(getProperty(object1, 'name'), { 
		value: 'joinbox', reference: {
			property: 'name',
			entity: object1,
		}
	});
	t.deepEqual(getProperty(object1, 'address.street'), { 
		value: 'brückfeld', 
		reference: {
			entity: object1.address,
			property: 'street'
		}
	});
});

test('works with arrays', (t) => {
	const { object1 } = setupData();
	t.deepEqual(getProperty(object1, 'phones.mobile.1'), { 
		value: '4321', reference: {
			property: '1',
			entity: object1.phones.mobile,
		}
	});
});