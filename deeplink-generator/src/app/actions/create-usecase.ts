"use server";

import { UsecaseStage } from "@prisma/client";
import { db } from "../../../db";
import { JsonSchemaObject } from "../utils";
import { InputJsonValue } from "@prisma/client/runtime/library";

export type CreateUsecaseType = {
	templateId: string;
	value: JsonSchemaObject;
};

export async function createUsecase({ templateId, value }: CreateUsecaseType) {
	const deepLink = await db.usecase.create({
		data: {
			templateId,
			value: value as unknown as InputJsonValue,
			usecaseStage: UsecaseStage.DRAFT,
		},
	});

	return deepLink;
}
