export const unflattenObject = (data: { [x: string]: any }, delimiter = '.') => {
	const result = {};
	for (const flatKey in data) {
		const keys = flatKey.split(delimiter);
		keys.reduce((acc, key, index) => {
			if (index === keys.length - 1) {
				acc[key] = data[flatKey];
			} else {
				if (!acc[key] || typeof acc[key] !== 'object') {
					acc[key] = {};
				}
			}
			return acc[key];
		}, result);
	}
	return result;
};

export const flattenObject = (
	obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any },
	parentKey = '',
	result = {}
) => {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			const newKey = parentKey ? `${parentKey}.${key}` : key;
			if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
				flattenObject(obj[key], newKey, result);
			} else {
				result[newKey] = obj[key];
			}
		}
	}
	return result;
};
