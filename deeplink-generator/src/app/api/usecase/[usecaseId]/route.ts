import { getUsecaseById } from "@/app/actions";
import { editDeepLinkValue } from "@/app/actions/edit-deep-link-value";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ usecaseId: string }> }
) {
	const usecaseId = (await params).usecaseId;
	const editedValue = await req.json();
	const deepLink = await getUsecaseById(usecaseId);
	if (!deepLink) {
		throw new Error("Deep Link not found");
	}
	console.log("OLD VALUE", deepLink.value);
	const newValue = {
		...(deepLink.value as object),
		...editedValue,
	};
	console.log("NEW VALUE", newValue);
	const updatedDeepLink = await editDeepLinkValue(
		usecaseId,
		newValue as InputJsonValue
	);
	return NextResponse.json(updatedDeepLink);
}
