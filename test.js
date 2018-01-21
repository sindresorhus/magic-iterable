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
	t.deepEqual(magicArray.increment(2), [2, 4, 6, 8]);
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

	t.deepEqual(m(array).increment(2), [2, 4, 6, 8]);
	t.is(fixture.i, 8);
});

test('does not work on heterogeneous iterable', t => {
	const createFixture = () => {
		return {
			foo() {}
		};
	};

	const array = [
		createFixture(),
		createFixture(),
		{},
		createFixture()
	];

	const magicArray = m(array);

	t.throws(() => {
		magicArray.foo();
	}, /Item 2 of the iterable is missing the foo property/);
});

test('should work on array of non-objects', t => {
	t.deepEqual(m(['a', 'b']).includes('b'), [false, true]);
});

test('should only apply to the items of the iterable', t => {
	const fixture = {
		foo() {
			return '🦄';
		}
	};

	const array = [fixture, fixture];
	array.foo = () => '🤡';

	t.deepEqual(m(array).foo(), ['🦄', '🦄']);
});

test('should support properties, not just methods', t => {
	t.deepEqual(m(['a', 'ab', 'abc']).length.toString(), ['1', '2', '3']);
});
