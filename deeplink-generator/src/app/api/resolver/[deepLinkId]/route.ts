import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ deepLinkId: string }> }
) {
	const deepLinkId = (await params).deepLinkId;
	// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
	// const {template ,...deepLink} = (await getUsecaseById(deepLinkId)) as any;
	// return NextResponse.json(deepLink);
	return redirect(
		`https://raw.githubusercontent.com/${process.env.OWNER_NAME_REPO}/${process.env.STORAGE_REPO_NAME}/refs/heads/master/deep-link-payload/json/${deepLinkId}.json`
	);
}
