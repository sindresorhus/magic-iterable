'use strict';

module.exports = iterable => {
	return new Proxy(iterable, {
		get(target, property) {
			function caller(...args) {
				const ret = [];
				for (const item of target) {
					ret.push(Reflect.apply(item[property], item, args));
				}
				return ret;
			}

			let i = 0;
			let isMethod = true;
			let ret = [];
			for (const item of target) {
				if (typeof item[property] === 'undefined') {
					throw new TypeError(`Item ${i} of the iterable is missing the ${property} property`);
				}
				isMethod = isMethod && typeof item[property] === 'function';
				ret.push(item[property]);
				i++;
			}

			if (isMethod) {
				// Make fake array out of caller function
				Object.defineProperty(caller, 'length', {
					value: ret.length
				});
				ret = Object.assign(caller, ret);
				ret[Symbol.iterator] = [][Symbol.iterator];
			}

			return ret;
		}
	});
};
