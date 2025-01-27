"use server";

import { TemplateStage } from "@prisma/client";
import { db } from "../../../db";
import { JsonSchemaObject } from "../utils";

export async function createTemplate(templateSchema: JsonSchemaObject) {
	const createdTemplate = await db.template.create({
		data: {
			templateStage: TemplateStage.DRAFT,
			value: {
				$schema: "https://json-schema.org/draft/2019-09/schema",
				properties: templateSchema,
			},
		},
	});
	return createdTemplate;
}
