'use strict';

module.exports = function magicIterable(iterable) {
	return new Proxy(iterable, {
		get(target, property) {
			function * iterator() {
				for (const item of target) {
					yield item[property];
				}
			}
			function * iteratorCaller(...args) {
				for (const item of target) {
					yield Reflect.apply(item[property], item, args);
				}
			}

			let i = 0;
			let isMethod = true;
			for (const item of target) {
				i++;
				if (typeof item[property] === 'undefined') {
					throw new TypeError(`Item ${i} of the iterable is missing the ${property} property`);
				}

				isMethod = isMethod && typeof item[property] === 'function';
			}

			const ret = magicIterable(isMethod ? iteratorCaller : {});
			ret[Symbol.iterator] = iterator;
			return ret;
		}
	});
};
