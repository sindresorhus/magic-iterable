'use strict';

const magicIterable = iterable => {
	return new Proxy(iterable, {
		get(target, property) {
			if (property === 'toArray') {
				return () => target;
			}
			if (target.length === 0) {
				return [];
			}
			if (typeof target[0][property] !== 'function') {
				const ret = [];
				let i = 0;
				for (const item of target) {
					i++;

					if (typeof item[property] === 'undefined') {
						throw new TypeError(`Item ${i} of the iterable is missing the ${property} property`);
					}

					ret.push(item[property]);
				}

				return magicIterable(ret);
			}
			return function (...args) {
				const ret = [];

				let i = 0;
				for (const item of target) {
					i++;

					if (typeof item[property] === 'undefined') {
						throw new TypeError(`Item ${i} of the iterable is missing the ${property}() method`);
					}

					ret.push(Reflect.apply(item[property], item, args));
				}

				return magicIterable(ret);
			};
		}
	});
};

module.exports = magicIterable;
