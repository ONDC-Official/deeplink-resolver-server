import { getUsecaseById } from "@/app/actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ deepLinkId: string }> }
) {
	const deepLinkId = (await params).deepLinkId;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
	const {template ,...deepLink} = (await getUsecaseById(deepLinkId)) as any;
	return NextResponse.json(deepLink);
}
