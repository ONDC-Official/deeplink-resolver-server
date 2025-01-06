"use server";

import { UsecaseStage } from "@prisma/client";
import { db } from "../../../db";
import { FormItem, inflateDeepLink } from "../utils";

export type CreateDeepLinkType = {
	templateId: string;
	value: FormItem[];
};

export async function createDeepLink({
	templateId,
	value,
}: CreateDeepLinkType) {
	console.log("Generating Deep Link...", templateId, value);
	const inflatedValue = inflateDeepLink(value);
	console.log("VALUE INFLATED", inflatedValue);
	const deepLink = await db.usecase.create({
		data: {
			templateId,
			value: inflatedValue,
			usecaseStage: UsecaseStage.DRAFT,
		},
	});
	console.log("USE CASE CREATED", deepLink);

	return deepLink;
}
