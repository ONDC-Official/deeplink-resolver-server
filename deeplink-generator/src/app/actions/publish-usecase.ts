"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Usecase, UsecaseStage } from "@prisma/client";
import { db } from "../../../db";
import { Octokit } from "@octokit/rest";
import QRCode from "qrcode";

const FOLDER_PATH = "usecases";

export async function publishUsecase(usecase: Usecase, form: FormData) {
	const updatedUsecase = await db.usecase.update({
		where: {
			id: usecase.id,
		},
		data: {
			usecaseStage: form.get("submissionOption") as UsecaseStage,
			name: form.get("name") as string,
		},
	});
	const octokit = new Octokit({
		auth: process.env.GITHUB_PAT,
	});

	if (
		(form.get("submissionOption") as UsecaseStage) === UsecaseStage.PUBLISHED
	) {
		const fileName = `${updatedUsecase.id}.json`;
		const filePath = `${FOLDER_PATH}/json/${fileName}`;
		const content = Buffer.from(
			JSON.stringify(updatedUsecase, null, 2)
		).toString("base64");

		try {
			await octokit.repos.getContent({
				owner: process.env.GITHUB_OWNER || "",
				repo: process.env.GITHUB_REPO || "",
				path: FOLDER_PATH,
			});
		} catch (error: any) {
			if (error.status === 404) {
				// Create the folder by creating a dummy file and then deleting it
				await octokit.repos.createOrUpdateFileContents({
					owner: process.env.GITHUB_OWNER || "",
					repo: process.env.GITHUB_REPO || "",
					path: `${FOLDER_PATH}/.gitkeep`,
					message: "Create hello folder",
					content: Buffer.from("").toString("base64"),
				});
			}
		}

		// Create the new JSON file
		await octokit.repos.createOrUpdateFileContents({
			owner: process.env.GITHUB_OWNER || "",
			repo: process.env.GITHUB_REPO || "",
			path: filePath,
			message: `Add user submission ${updatedUsecase.id}`,
			content,
		});
	}

	const fileName = `${updatedUsecase.id}.png`;
	const filePath = `${FOLDER_PATH}/qr/${fileName}`;
	
	const qrCodeBase64 = await QRCode.toDataURL(
		JSON.stringify(updatedUsecase.value, null, 2)
	);

	// Convert base64 to buffer (remove data:image/png;base64, prefix)
	const qrCodeBuffer = Buffer.from(qrCodeBase64.split(",")[1], "base64");


	await octokit.repos.createOrUpdateFileContents({
		owner: process.env.GITHUB_OWNER || "",
		repo: process.env.GITHUB_REPO || "",
		path: filePath,
		message: `Update QR code for ${updatedUsecase.id}`,
		content: qrCodeBuffer.toString('base64')
	});

	return updatedUsecase;
}
