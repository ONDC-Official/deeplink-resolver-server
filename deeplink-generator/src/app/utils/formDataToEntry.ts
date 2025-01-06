import { FormItem } from "./inflate";

export function formDataToEntry<T>(form: FormData): T {
	const entries = Array.from(form.entries());
	const result = entries.reduce((acc, [key, value]) => {
		return {
			...acc,
			[key]: value,
		};
	}, {} as T);

	return result;
}

export function formDataToFormItemArray(form: FormData): FormItem[] {
	const result = Array.from(form.entries()).map(
		([key, value]) =>
			({
				name: key,
				value: value,
			} as FormItem)
	);

	return result;
}
