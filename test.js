import test from 'ava';
import magicIterable from './index.js';

test('main', t => {
	let index = 0;

	const createFixture = () => ({
		increment(value) {
			index += value;
			return index;
		},
	});

	const array = [
		createFixture(),
		createFixture(),
		createFixture(),
		createFixture(),
	];

	const magicArray = magicIterable(array);

	t.true(Array.isArray(magicArray));
	t.deepEqual(magicArray.increment(2), [2, 4, 6, 8]);
	t.is(index, 8);
});

test('`this` works correctly', t => {
	const fixture = {
		index: 0,
		increment(value) {
			this.index += value;
			return this.index;
		},
	};

	const array = [fixture, fixture, fixture, fixture];

	t.deepEqual(magicIterable(array).increment(2), [2, 4, 6, 8]);
	t.is(fixture.index, 8);
});

test('does not work on heterogeneous iterable', t => {
	const createFixture = () => ({
		foo() {},
	});

	const array = [
		createFixture(),
		createFixture(),
		{},
		createFixture(),
	];

	const magicArray = magicIterable(array);

	t.throws(() => {
		magicArray.foo();
	}, {
		message: /Item 3 of the iterable is missing the foo\(\) method/,
	});
});

test('should work on array of non-objects', t => {
	t.deepEqual(magicIterable(['a', 'b']).includes('b'), [false, true]);
});

test('should only apply to the items of the iterable', t => {
	const fixture = {
		foo() {
			return '🦄';
		},
	};

	const array = [fixture, fixture];
	array.foo = () => '🤡';

	t.deepEqual(magicIterable(array).foo(), ['🦄', '🦄']);
});

test.failing('should support properties, not just methods', t => {
	t.deepEqual(magicIterable(['a', 'ab', 'abc']).length.toString(), ['1', '2', '3']);
});
