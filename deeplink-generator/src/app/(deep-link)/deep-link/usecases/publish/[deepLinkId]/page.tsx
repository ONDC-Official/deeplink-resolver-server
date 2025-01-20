import {
	getUsecaseById,
	publishUsecase,
	PublishUsecaseFormType,
} from "@/app/actions";
import {
	CustomContainedButtom,
	CustomHeading,
	FieldName,
	UsecaseEditor,
} from "@/app/components";
import { formDataToEntry } from "@/app/utils";
import {
	Box,
	Divider,
	Grid2 as Grid,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
	Stack,
} from "@mui/material";
import { UsecaseStage } from "@prisma/client";
import Form from "next/form";
import { redirect } from "next/navigation";
import React from "react";

const PublishDeepLinkPage = async ({
	params,
}: {
	params: Promise<{ deepLinkId: string }>;
}) => {
	const deepLinkId = (await params).deepLinkId;
	const usecase = await getUsecaseById(deepLinkId);
	if (!usecase || usecase.usecaseStage !== UsecaseStage.DRAFT) {
		return (
			<>
				<CustomHeading heading="PUBLISH DEEP LINK" />
				<Paper
					elevation={4}
					sx={{
						p: 2,
						borderColor: "primary.light",
						borderWidth: 2,
						borderStyle: "solid",
						borderRadius: 2,
						my: 4,
						width: "100%",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
					}}
				>
					<Typography variant="h5">
						Deep Link either does not exist or is not in draft stage@
					</Typography>
					<CustomContainedButtom buttonBaseProps={{ href: "/" }}>
						Go Home
					</CustomContainedButtom>
				</Paper>
			</>
		);
	}
	const handleFormSubmit = async (formData: FormData) => {
		"use server";
		const form = formDataToEntry<PublishUsecaseFormType>(formData);
		const publishedUsecase = await publishUsecase({ usecase: usecase!, form });
		redirect(`/deep-link/usecases/thank-you/${publishedUsecase.id}`);
	};
	return (
		<>
			<CustomHeading heading="PUBLISH DEEP LINK" />
			<Form
				action={handleFormSubmit}
				formMethod="POST"
				style={{ width: "100%" }}
			>
				<Paper
					elevation={4}
					sx={{
						p: 2,
						borderColor: "primary.light",
						borderWidth: 2,
						borderStyle: "solid",
						borderRadius: 2,
						my: 4,
					}}
				>
					<Grid container spacing={1}>
						<Grid size={{ xs: 6, md: 12 }}>
							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Creater's Name" />
								<TextField sx={{ ml: 1 }} name="creatorName" fullWidth />
							</Stack>

							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Deeplink Name" />
								<TextField sx={{ ml: 1 }} name="name" fullWidth required />
							</Stack>

							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Description" />
								<TextField
									sx={{ ml: 1 }}
									name="description"
									fullWidth
									required
								/>
							</Stack>

							<Divider />
							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Publish" />
								<Typography variant="h5">&nbsp; &nbsp;</Typography>
								<Select
									name="submissionOption"
									defaultValue={UsecaseStage.PUBLISHED}
									fullWidth
									required
								>
									{/* <MenuItem value={UsecaseStage.SUBMITTED}>
										Save Private
									</MenuItem> */}
									<MenuItem value={UsecaseStage.PUBLISHED}>
										Publish to server
									</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Grid>
						<Grid size={{ xs: 12 }}>
							<Grid size={{ xs: 12 }}>
								<UsecaseEditor usecase={usecase!} />
								{/* <Typography>{JSON.stringify(usecase?.value)}</Typography> */}
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
						my: 2,
					}}
				>
					<CustomContainedButtom buttonBaseProps={{ type: "submit" }}>
						Submit
					</CustomContainedButtom>
				</Box>
			</Form>
		</>
	);
};

export default PublishDeepLinkPage;
