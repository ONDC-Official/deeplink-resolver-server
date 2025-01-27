import {
	ComponentableSchema,
	JsonSchemaObject,
} from "./fromJSONSchemaToComponentable";

export function fromComponentableToJSONSchema(
	componentable: Record<string, ComponentableSchema>
): JsonSchemaObject {
	const result: JsonSchemaObject = {
		type: "object",
		properties: {},
		required: [],
	};

	for (const [path, schema] of Object.entries(componentable)) {
		let current = result;
		const parts = path.split(".");

		// Handle nested paths
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isLast = i === parts.length - 1;
			const isArray = part.endsWith("[]");
			const cleanPart = part.replace("[]", "");

			if (isArray) {
				if (!current.properties![cleanPart]) {
					current.properties![cleanPart] = {
						type: "array",
						items: {
							type: "object",
							properties: {},
						},
					};
				}
				current = current.properties![cleanPart].items!;
				continue;
			}

			if (!isLast) {
				if (!current.properties![cleanPart]) {
					current.properties![cleanPart] = {
						type: "object",
						properties: {},
					};
				}
				current = current.properties![cleanPart];
			} else {
				// Convert ComponentableSchema to JsonSchemaObject
				const jsonSchema: JsonSchemaObject = {
					type:
						schema.type === "select"
							? "string"
							: schema.type === "checkbox"
							? "boolean"
							: schema.type,
				};

				if (schema.options) {
					jsonSchema.oneOf = schema.options.map((opt) => ({
						const: opt.value.toString(),
						title: opt.label,
					}));
				}

				if (schema.defaultValue !== undefined) {
					jsonSchema.const = schema.defaultValue.toString();
				}

				if (schema.filler) {
					jsonSchema.$comment = `filler:${schema.filler}`;
				}

				current.properties![cleanPart] = jsonSchema;

				if (schema.required) {
					if (!current.required) current.required = [];
					current.required.push(cleanPart);
				}
			}
		}
	}

	return result;
}
