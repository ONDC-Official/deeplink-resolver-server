"use server";
import { db } from "../../../db";

export async function getUsecaseSubcategories(usecaseCategoryId: string) {
	return db.usecaseSubcategory.findMany({
		where: {
			usecaseCategoryId,
		}
	});
}
