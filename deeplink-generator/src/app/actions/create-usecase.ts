"use server";

import { UsecaseStage } from "@prisma/client";
import { db } from "../../../db";
import { FormItem, inflateDeepLink } from "../utils";

export type CreateUsecaseType = {
	templateId: string;
	value: FormItem[];
};

export async function createUsecase({
	templateId,
	value,
}: CreateUsecaseType) {
	const inflatedValue = inflateDeepLink(value);
	const deepLink = await db.usecase.create({
		data: {
			templateId,
			value: inflatedValue,
			usecaseStage: UsecaseStage.DRAFT,
		},
	});

	return deepLink;
}
