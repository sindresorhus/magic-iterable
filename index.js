'use strict';

const exceptions = [
	Symbol.iterator,
	'length'
];

module.exports = iterable => {
	return new Proxy(iterable, {
		get(target, property) {
			if (exceptions.includes(property)) {
				return iterable[property];
			}
			console.log('asked for', property)
			function caller(...args) {
				let i = 0;
				const ret = [];
				for (const item of target) {
					if (typeof item[property] === 'undefined') {
						throw new TypeError(`Item ${i} of the iterable is missing the ${String(property)} property`);
					}
					i++;
					ret.push(Reflect.apply(item[property], item, args));
				}
				return ret;
			}

			let isMethod = true;
			let ret = [];
			for (const item of target) {
				console.log(item)
				isMethod = isMethod && typeof item[property] === 'function';
				ret.push(item[property]);
			}
			console.log('done')

			if (isMethod) {
				// Make fake array out of caller function
				Object.defineProperties(caller, {
					length: {
						value: ret.length
					}
				});
				ret = Object.assign(caller, ret);
				ret[Symbol.toStringTag] = [][Symbol.toStringTag];
				ret[Symbol.iterator] = [][Symbol.iterator];
			}

			return ret;
		}
	});
};
