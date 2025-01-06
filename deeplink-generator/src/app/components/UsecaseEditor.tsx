"use client";
import { CancelTwoTone, EditTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
	Box,
	ButtonGroup,
	Divider,
	Grid2 as Grid,
	IconButton,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
	FillerTypeObject,
	flattenTemplate,
	FormItem,
	inflateDeepLink,
} from "../utils";
import { FieldName } from "./FieldName";

type UsecaseEditorProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	usecase: any;
};
export const UsecaseEditor = ({ usecase }: UsecaseEditorProps) => {
	const flattenedTemplate = flattenTemplate(usecase.template.value);
	const flattenedUsecase = flattenTemplate(usecase.value);
	console.log("usecase", flattenedUsecase);
	console.log("flattened template", flattenedTemplate);
	console.log(
		"Included",
		Object.keys(flattenedUsecase).every((t) =>
			Object.keys(flattenedTemplate).includes(t)
		)
	);
	const [usecaseState, setUsecaseState] = useState(flattenedUsecase);
	const [editUsecase, setEditUsecase] = useState(false);
	const handleUsecaseEdit = async () => {
		const edit = Object.keys(usecaseState).map(
			(each) =>
				({
					name: each,
					value: usecaseState[each],
				} as FormItem)
		);
		const inflate = inflateDeepLink(edit);
		const res = await fetch(`/usecase/${usecase.id}`, {
			method: "PATCH",
			body: JSON.stringify(inflate),
		});
		if (res.status !== 200)
			console.log("Error While updating usecase", res.body);
		setEditUsecase(false);
	};

	return (
		<>
			<Divider />
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					my: 1,
				}}
			>
				<Typography variant="h5">Value :</Typography>
				{!editUsecase ? (
					<IconButton onClick={() => setEditUsecase(true)} color="info">
						<EditTwoTone />
					</IconButton>
				) : (
					<ButtonGroup>
						<IconButton color="success" onClick={handleUsecaseEdit}>
							<SaveTwoTone />
						</IconButton>
						<IconButton onClick={() => setEditUsecase(false)} color="error">
							<CancelTwoTone />
						</IconButton>
					</ButtonGroup>
				)}
			</Box>
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
				<Grid container spacing={1}>
					{Object.keys(flattenedTemplate)
						.filter(
							(key) =>
								(flattenedTemplate[key] as FillerTypeObject).filler !==
									"admin" &&
								(flattenedTemplate[key] as FillerTypeObject).filler !== "pg"
						)
						.map((key: string) => (
							<React.Fragment key={key}>
								<Grid size={{ xs: 12, md: 5 }}>
									<FieldName fieldName={key} paperSx={{width: "100%"}}/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									{typeof flattenedTemplate[key] === "string" ? (
										<TextField
											disabled
											defaultValue={flattenedTemplate[key]}
											fullWidth
										/>
									) : (
										<TextField
											name={key}
											disabled={!editUsecase}
											defaultValue={usecaseState[key]}
											onChange={(e) =>
												setUsecaseState((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
											fullWidth
										/>
									)}
								</Grid>
							</React.Fragment>
						))}
				</Grid>
			</Paper>
		</>
	);
};
