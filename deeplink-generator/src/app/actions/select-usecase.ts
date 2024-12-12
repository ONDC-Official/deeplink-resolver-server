"use server";

import { redirect } from "next/navigation";

export async function selectUsecase(form: FormData) {
	console.log("Selected Usecase: ", form.get("templateId"));
	redirect(`/deep-link/templates/${form.get("templateId")}`);
}