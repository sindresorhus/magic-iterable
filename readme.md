# magic-iterable

> Call a method on all items in an iterable by calling it on the iterable itself

Uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy).

## Install

```
$ npm install magic-iterable
```

## Usage

```js
import magicIterable from 'magic-iterable';

const x = {
	index: 0,
	increment(value) {
		this.index += value;
		return this.index;
	}
};

const array = [x, x, x, x];
const magicArray = magicIterable(array);

Array.isArray(magicArray);
//=> true

magicArray.increment(2);
//=> [2, 4, 6, 8];

x.index;
//=> 8
```

```js
import magicIterable from 'magic-iterable';

// Subscribes to click events for all `<a>` elements
magicIterable(document.querySelectorAll('a')).addEventListener('click', () => {
	console.log('Click');
});
```

## API

### magicIterable(iterable)

Returns a version of `iterable` that when you call a method on it, it will call that method on all items in the iterable and return an array with the result.

#### iterable

Type: [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol) *(For example, an `Array`)*

Iterable where all the items has the method you want to call.

## Related

- [on-change](https://github.com/sindresorhus/on-change) - Watch an object or array for changes (Uses `Proxy` too)
- [negative-array](https://github.com/sindresorhus/negative-array) - Negative array index support (Uses `Proxy` too)
- [known](https://github.com/sindresorhus/known) - Allow only access to known object properties (Uses `Proxy` too)
