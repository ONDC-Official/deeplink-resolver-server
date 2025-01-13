/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormItem {
	name: string;
	value: string;
}

export function inflateTemplate(formData: FormItem[]) {
	// Create maps to store keys and values
	const keyMap = new Map<string, string>();
	const valueMap = new Map<string, string>();

	// Separate keys and values
	formData.forEach((item) => {
    console.log("item", item);
		if (item.name.startsWith("form_key.")) {
			keyMap.set(item.name.replace("form_key.", ""), item.value);
		} else if (item.name.startsWith("form_value.")) {
			valueMap.set(item.name.replace("form_value.", ""), item.value);
		}
	});

	// Create the result object
	const result: any = {};

	// Helper function to set nested object value
	const setNestedValue = (obj: any, path: string, value: any) => {
		const parts = path.split(".");
		let current = obj;

		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (part.includes("[")) {
				const [arrayName, indexStr] = part.split("[");
				const index = parseInt(indexStr);
				current[arrayName] = current[arrayName] || [];
				current[arrayName][index] = current[arrayName][index] || {};
				current = current[arrayName][index];
			} else {
				current[part] = current[part] || {};
				current = current[part];
			}
		}

		const lastPart = parts[parts.length - 1];
		try {
			// Try to parse JSON values
			current[lastPart] = JSON.parse(value);
		} catch {
			// If not JSON, use the raw value
			current[lastPart] = value;
		}
	};

	// Match keys with values and build the object
	keyMap.forEach((_, key) => {
		if (valueMap.has(key)) {
			setNestedValue(result, key, valueMap.get(key));
		}
	});

	return result;
}


export function inflateDeepLink(formData: FormItem[]) {
	const result: any = {};

	const setNestedValue = (obj: any, path: string, value: any) => {
			const parts = path.split(".");
			let current = obj;

			for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i];
					if (part.includes("[")) {
							const [arrayName, indexStr] = part.split("[");
							const index = parseInt(indexStr);
							current[arrayName] = current[arrayName] || [];
							current[arrayName][index] = current[arrayName][index] || {};
							current = current[arrayName][index];
					} else {
							current[part] = current[part] || {};
							current = current[part];
					}
			}

			const lastPart = parts[parts.length - 1];
			try {
					current[lastPart] = JSON.parse(value);
			} catch {
					current[lastPart] = value;
			}
	};

	formData.forEach((item) => {
			setNestedValue(result, item.name, item.value);
	});
	return result;
}
