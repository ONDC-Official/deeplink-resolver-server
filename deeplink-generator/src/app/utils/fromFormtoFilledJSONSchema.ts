import { FillerType, JsonSchemaObject } from "./fromJSONSchemaToComponentable";
import { FormItem } from "./inflate";

export function fromFormtoFilledJSONSchema(
	formValues: FormItem[],
	originalSchema: JsonSchemaObject,
	filler: FillerType
): JsonSchemaObject {
	if (!filler) throw new Error("filler is required");
	const result: JsonSchemaObject = JSON.parse(JSON.stringify(originalSchema));

	function updateSchema(schema: JsonSchemaObject, path: string) {
		if (schema.type === "object" && schema.properties) {
			for (const [key, value] of Object.entries(schema.properties)) {
				const newPath = path ? `${path}.${key}` : key;
				updateSchema(value, newPath);
			}
		} else if (schema.type === "array" && schema.items) {
			updateSchema(schema.items, `${path}[]`);
		} else {
			const fillerComment = schema.$comment
				?.split(";")
				.find((comment) => comment.trim().startsWith("filler:"))
				?.split(":")[1]
				?.trim();

			if (fillerComment === filler) {
				const formValue = formValues.find((item) => item.name === path);
				if (formValue) {
					schema.const = formValue.value;
				}
			}
		}
	}

	updateSchema(result, "");
	return result;
}
