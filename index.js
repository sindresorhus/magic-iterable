export default function magicIterable(iterable) {
	return new Proxy(iterable, {
		get(target, property) {
			return function (...arguments_) {
				const returnValue = [];

				let index = 0;
				for (const item of target) {
					index++;

					if (typeof item[property] === 'undefined') {
						throw new TypeError(`Item ${index} of the iterable is missing the ${property}() method`);
					}

					returnValue.push(Reflect.apply(item[property], item, arguments_));
				}

				return returnValue;
			};
		},
	});
}
