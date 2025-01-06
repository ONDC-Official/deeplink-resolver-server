import {
	Box,
	Divider,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";
import Form from "next/form";

import {
	FillerTypeObject,
	flattenTemplate,
	formDataToFormItemArray,
	inputTypeMapper,
	NamedEnum,
} from "@/app/utils";
import { createDeepLink, getTemplateById } from "@/app/actions";
import {
	CustomContainedButtom,
	CustomHeading,
	FieldName,
} from "@/app/components";
import { redirect } from "next/navigation";
const GenerateDeepLinkPage = async ({
	params,
}: {
	params: Promise<{ templateId: string }>;
}) => {
	const templateId = (await params).templateId;
	const template = await getTemplateById(templateId);
	const templateValue = flattenTemplate(template!.value);
	console.log("TEMPLATE VALUE", templateValue);
	const handleSubmit = async (form: FormData) => {
		"use server";
		if (!form) {
			throw new Error("Form data is required");
		}
		console.log("CREATING DEEP LINK");
		const value = formDataToFormItemArray(form)
		const deepLink = await createDeepLink({templateId, value});
		console.log("Redirecting");
		redirect(`/deep-link/usecases/publish/${deepLink.id}`);
	};
	return (
		<>
			<CustomHeading heading="DEEP LINK GENERATOR" />
			<Paper
				elevation={4}
				sx={{
					p: 2,
					borderColor: "primary.light",
					borderWidth: 2,
					borderStyle: "solid",
					borderRadius: 2,
					my: 2,
					width: "100%",
				}}
			>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						flexDirection: "row",
						gap: 2,
						mb: 2,
					}}
				>
					<Typography>Template Name</Typography>
					<Typography>:</Typography>
					<Typography variant="body2">{template?.name}</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						flexDirection: "row",
						gap: 2,
						mb: 2,
					}}
				>
					<Typography>Template Description</Typography>
					<Typography>:</Typography>
					<Typography variant="body2">{template?.description}</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						flexDirection: "row",
						gap: 2,
						mb: 2,
					}}
				>
					<Typography>Template Category:</Typography>
					<Typography>:</Typography>
					<Typography variant="body2">{template?.category?.name}</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "flex-start",
						flexDirection: "row",
						gap: 2,
						mb: 2,
					}}
				>
					<Typography>Template Subcategory</Typography>
					<Typography>:</Typography>
					<Typography variant="body2">{template?.subCategory?.name}</Typography>
				</Box>
			</Paper>
			<Form action={handleSubmit} formMethod="POST" style={{ width: "100%" }}>
				<Paper
					elevation={4}
					sx={{
						p: 2,
						borderColor: "primary.light",
						borderWidth: 2,
						borderStyle: "solid",
						borderRadius: 2,
						my: 2,
					}}
				>
					{Object.keys(templateValue)
						.filter(
							(key) =>
								(templateValue[key] as FillerTypeObject).filler === "user"
						)
						.map((key: string) => (
							<React.Fragment key={key}>
								<Stack
									direction="row"
									my={2}
									alignItems="center"
									justifyContent="flex-start"
								>
									<FieldName fieldName={key} />
									<Typography mx={1}>:</Typography>
									{(templateValue[key] as FillerTypeObject)?.enum &&
									(templateValue[key] as FillerTypeObject)?.enum!.length > 0 ? (
										<Select
											defaultValue={
												typeof (templateValue[key] as FillerTypeObject)
													.enum?.[0] === "object"
													? (
															(templateValue[key] as FillerTypeObject)
																.enum?.[0] as NamedEnum
													  )?.value
													: (templateValue[key] as FillerTypeObject).enum?.[0]
											}
											fullWidth
											name={key}
										>
											{(templateValue[key] as FillerTypeObject).enum?.map(
												(value, index) => (
													<MenuItem
														key={key + "option" + index}
														value={
															typeof value === "object"
																? (value as NamedEnum).value
																: value
														}
													>
														<Typography variant="body2">
															{typeof value === "object"
																? (value as NamedEnum).name
																: value}
														</Typography>
													</MenuItem>
												)
											)}
										</Select>
									) : (
										<TextField
											defaultValue={
												(templateValue[key] as FillerTypeObject).value
											}
											type={inputTypeMapper(
												(templateValue[key] as FillerTypeObject).type
											)}
											sx={{ ml: 1 }}
											name={key}
											fullWidth
										/>
									)}
								</Stack>
								<Divider />
							</React.Fragment>
						))}
					{Object.keys(templateValue)
						.filter(
							(key) =>
								(templateValue[key] as FillerTypeObject).filler !== "user"
						)
						.map((key: string, index) => (
							<input
								type="hidden"
								key={key + index}
								defaultValue={
									typeof templateValue[key] === "object"
										? JSON.stringify(templateValue[key])
										: String(templateValue[key])
								}
								name={key}
							/>
						))}
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

export default GenerateDeepLinkPage;
