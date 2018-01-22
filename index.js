'use strict';

const magicIterable = iterable => {
	return new Proxy(iterable, {
		get(target, property) {
			if (property === '_toArray') {
				return () => target;
			}

			let ret = [];
			let isMethod = false;

			for (const item of target) {
				if (typeof item[property] === 'function') {
					isMethod = true;
					ret = [];
					break;
				}
				ret.push(item[property]);
			}

			if (isMethod) {
				return function (...args) {
					for (const item of target) {
						if (typeof item === 'undefined' || item === null || typeof item[property] === 'undefined') {
							ret.push(undefined);
							continue;
						}
						if (typeof item[property] === 'function') {
							ret.push(Reflect.apply(item[property], item, args));
							continue;
						}
						ret.push(item[property]);
					}

					return magicIterable(ret);
				};
			}

			return magicIterable(ret);
		}
	});
};

module.exports = magicIterable;
