"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Usecase, UsecaseStage } from "@prisma/client";
import { db } from "../../../db";
import { Octokit } from "@octokit/rest";
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
	if (
		(form.get("submissionOption") as UsecaseStage) === UsecaseStage.PUBLISHED
	) {
		const fileName = `${updatedUsecase.id}.json`;
		const filePath = `${FOLDER_PATH}/${fileName}`;
		const content = Buffer.from(
			JSON.stringify(updatedUsecase, null, 2)
		).toString("base64");

		const octokit = new Octokit({
			auth: process.env.GITHUB_PAT,
		});

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

	return updatedUsecase;
}