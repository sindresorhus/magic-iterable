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
	}, /Item 3 of the iterable is missing the foo\(\) method/);
});
