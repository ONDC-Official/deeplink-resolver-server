export type JsonSchemaObject = {
	$schema?: string;
	$id?: string;
	$ref?: string;
	$comment?: string;
	type:
		| "object"
		| "array"
		| "string"
		| "number"
		| "integer"
		| "boolean"
		| "null";
	properties?: {
		[key: string]: JsonSchemaObject;
	};
	items?: JsonSchemaObject;
	required?: string[];
	additionalProperties?: boolean;
	oneOf?: Array<string | number | boolean | { const: string; title: string }>;
	const?: string;
};

export type FillerType = "system" | "admin" | "user" | "consumer";
export type SupportedFieldTypes = "string" | "number" | "select" | "checkbox";
export type ComponentableSchema = {
	disabled: boolean;
	required: boolean;
	type: SupportedFieldTypes;
	options?: Array<{ value: string | number | boolean; label: string }>;
	defaultValue?: string | number | boolean;
	filler?: FillerType;
};

export function fromJSONSchemaToComponentable(obj: JsonSchemaObject) {
	const result: Record<string, ComponentableSchema> = {};
	function flatten(
		obj: JsonSchemaObject,
		prefix = "",
		required?: Array<string>
	) {
		if (obj.type === "object") {
			if (obj.properties) {
				for (const [key, value] of Object.entries(obj.properties)) {
					const fullKey = prefix ? `${prefix}.${key}` : key;
					flatten(value, fullKey, obj.required);
				}
			}
		} else if (obj.type === "array") {
			if (obj.items) {
				flatten(obj.items, prefix + "[]", obj.required);
			}
		} else {
			const tempPrefix = prefix.replace(/\[\]$/, "");
			if (obj.const) {
				result[prefix] = {
					disabled: true,
					required:
						required?.includes(tempPrefix.split(".").pop() || tempPrefix) ||
						false,
					type: obj.oneOf?.length
						? "select"
						: obj.type === "boolean"
						? "checkbox"
						: (obj.type as "string" | "number"),
					options: obj.oneOf?.map((item) => {
						if (typeof item === "object") {
							return {
								value: item.const,
								label: item.title,
							};
						} else {
							return {
								value: item.toString(),
								label: item.toString(),
							};
						}
					}),
					defaultValue: obj.const,
					filler: obj.$comment
						?.split(";")
						.filter((each) => each.split(":")[0] === "filler")[0]
						?.split(":")[1]
						?.trim() as FillerType,
				};
			} else {
				result[prefix] = {
					disabled: false,
					required:
						required?.includes(tempPrefix.split(".").pop() || tempPrefix) ||
						false,
					type: obj.oneOf?.length
						? "select"
						: obj.type === "boolean"
						? "checkbox"
						: (obj.type as "string" | "number"),
					options: obj.oneOf?.map((item) => {
						if (typeof item === "object") {
							return {
								value: item.const,
								label: item.title,
							};
						} else {
							return {
								value: item.toString(),
								label: item.toString(),
							};
						}
					}),
					filler: obj.$comment
						?.split(";")
						.filter((each) => each.split(":")[0] === "filler")[0]
						?.split(":")[1]
						?.trim() as FillerType,
				};
			}
		}
	}
	flatten(obj);
	return result;
}
