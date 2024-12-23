import { getUsecaseById, publishUsecase } from "@/app/actions";
import {
	CustomContainedButtom,
	CustomHeading,
	FieldName,
} from "@/app/components";
import JsonViewer from "@/app/components/JsonViewer";
import {
	Box,
	Divider,
	Grid2 as Grid,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
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
	const handleFormSubmit = async (form: FormData) => {
		"use server";
		if (!form) {
			throw new Error("Form data is required");
		}
		const publishedUsecase = await publishUsecase(usecase!, form);
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
								<FieldName fieldName="Creater's Name"/>
								<Typography variant="h5">&nbsp; &nbsp;</Typography>
								<TextField sx={{ ml: 1 }} name="Creater's Name" fullWidth />
							</Stack>

							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Deeplink Name"/>
								<Typography variant="h5">&nbsp; &nbsp;</Typography>
								<TextField sx={{ ml: 1 }} name="Deeplink Name" fullWidth />
							</Stack>

							<Stack
								direction="row"
								my={2}
								alignItems="center"
								justifyContent="flex-start"
							>
								<FieldName fieldName="Description"/>
								<Typography variant="h5">&nbsp; &nbsp;</Typography>
								<TextField sx={{ ml: 1 }} name="Description" fullWidth />
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
								>
									<MenuItem value={UsecaseStage.SUBMITTED}>
										Save Private
									</MenuItem>
									<MenuItem value={UsecaseStage.PUBLISHED}>
										Publish to server
									</MenuItem>
								</Select>
							</Stack>
							<Divider />
						</Grid>
						<Grid size={{ xs: 6, md: 12 }}>
							<JsonViewer data={usecase?.value as object}/>
							{/* <Typography>{JSON.stringify(usecase?.value)}</Typography> */}
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
					<CustomContainedButtom type="submit">Submit</CustomContainedButtom>
				</Box>
			</Form>
		</>
	);
};

export default PublishDeepLinkPage;
