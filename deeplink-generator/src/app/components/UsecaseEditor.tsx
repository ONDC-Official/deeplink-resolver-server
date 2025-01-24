"use client";
import { CancelTwoTone, EditTwoTone, SaveTwoTone } from "@mui/icons-material";
import {
	Box,
	ButtonGroup,
	Divider,
	Grid2 as Grid,
	IconButton,
	MenuItem,
	Paper,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
	FormItem,
	fromJSONSchemaToComponentable,
	inflateDeepLink,
} from "../utils";
import { FieldName } from "./FieldName";

type UsecaseEditorProps = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	usecase: any;
};
export const UsecaseEditor = ({ usecase }: UsecaseEditorProps) => {
	const flattenedTemplate = fromJSONSchemaToComponentable(
		usecase.template.value
	);
	const flattenedUsecase = fromJSONSchemaToComponentable(usecase.value);
	console.log("Flattened Usecase ::::", flattenedUsecase);
	const [usecaseState, setUsecaseState] = useState(
		Object.keys(flattenedUsecase)
			.map((key) => ({
				[key]: flattenedUsecase[key].defaultValue,
			}))
			.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as {
			[key: string]: string | number | boolean;
		}
	);
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
		const res = await fetch(`/api/usecase/${usecase.id}`, {
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
			<Typography variant="h5" textAlign="left">
				Value :
			</Typography>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					my: 1,
				}}
			>
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
				{Object.keys(usecaseState)
					.filter(
						(key) =>
							flattenedUsecase[key].filler !== "admin" &&
							flattenedUsecase[key].filler !== "consumer"
					)
					.map((key: string) => (
						<React.Fragment key={key}>
							<Grid container spacing={1}>
								<Grid
									size={{ xs: 12, md: 6 }}
									alignItems="center"
									justifyContent="flex-start"
									display="flex"
								>
									<FieldName fieldName={key} paperSx={{ width: "100%" }} />
									<Typography mx={1}>:</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 5 }}>
									{flattenedUsecase[key]?.type === "select" ? (
										<Select
											defaultValue={flattenedUsecase[key].options![0].value}
											fullWidth
											name={key}
											required={flattenedUsecase[key].required}
											disabled={
												!editUsecase || flattenedUsecase[key].filler !== "user"
											}
											onChange={(e) =>
												setUsecaseState((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
										>
											{flattenedUsecase[key].options?.map((value, index) => (
												<MenuItem
													key={key + "option" + index}
													value={value.value.toString()}
												>
													<Typography variant="body2">{value.label}</Typography>
												</MenuItem>
											))}
										</Select>
									) : (
										<TextField
											defaultValue={flattenedUsecase[key].defaultValue}
											type={flattenedUsecase[key].type}
											name={key}
											fullWidth
											required={flattenedUsecase[key].required}
											disabled={
												!editUsecase || flattenedUsecase[key].filler !== "user"
											}
											onChange={(e) =>
												setUsecaseState((prev) => ({
													...prev,
													[key]: e.target.value,
												}))
											}
										/>
									)}
								</Grid>
							</Grid>
							<Divider sx={{ my: 2 }} />
						</React.Fragment>
					))}
			</Paper>
		</>
	);
};
