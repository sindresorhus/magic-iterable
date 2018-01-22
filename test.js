import test from 'ava';
import m from '.';

test('main', t => {
	let i = 0;

	const createFixture = () => {
		return {
			increment(value) {
				i += value;
				return i;
			}
		};
	};

	const array = [
		createFixture(),
		createFixture(),
		createFixture(),
		createFixture()
	];

	const magicArray = m(array);

	t.true(Array.isArray(magicArray));
	t.deepEqual(magicArray.increment(2)._toArray(), [2, 4, 6, 8]);
	t.is(i, 8);
});

test('`this` works correctly', t => {
	const fixture = {
		i: 0,
		increment(value) {
			this.i += value;
			return this.i;
		}
	};

	const array = [fixture, fixture, fixture, fixture];

	t.deepEqual(m(array).increment(2)._toArray(), [2, 4, 6, 8]);
	t.is(fixture.i, 8);
});

test('Should return undefined if the property/method is missing', t => {
	const createFixture = () => {
		return {
			foo() {
				return '🦄';
			}
		};
	};

	const array = [
		createFixture(),
		createFixture(),
		{},
		createFixture()
	];

	t.deepEqual(m(array).foo()._toArray(), ['🦄', '🦄', undefined, '🦄']);
});

test('should work on array of non-objects', t => {
	t.deepEqual(m(['a', 'b']).includes('b')._toArray(), [false, true]);
});

test('should only apply to the items of the iterable', t => {
	const fixture = {
		foo() {
			return '🦄';
		}
	};

	const array = [fixture, fixture];
	array.foo = () => '🤡';

	t.deepEqual(m(array).foo()._toArray(), ['🦄', '🦄']);
});

test('should support properties, not just methods', t => {
	t.deepEqual(m(['a', 'ab', 'abc']).length.toString()._toArray(), ['1', '2', '3']);
});

test('should support properties and methods mixed', t => {
	const createMethodFixture = () => {
		return {
			foo() {
				return '🦄';
			}
		};
	};
	const createPropertyFixture = () => {
		return {
			foo: '🦄'
		};
	};

	const array = [
		createMethodFixture(),
		createPropertyFixture(),
		createMethodFixture(),
		createPropertyFixture()
	];
	// if the property type is function, it should return a function which will return an iterable.
	t.deepEqual((m(array).foo)()._toArray(), ['🦄', '🦄', '🦄', '🦄']);
});
