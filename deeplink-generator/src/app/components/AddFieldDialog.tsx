"use client";
import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Fade,
	Grid2 as Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { FormEvent } from "react";
import { ComponentableSchema, FillerType, SupportedFieldTypes } from "../utils";

export type NewFieldType = {
	fieldName: string;
} & ComponentableSchema;

type AddFieldDialogProps = {
	open: boolean;
	onClose: () => void;
	addFieldAction: (newField: NewFieldType) => void;
};

const AddFieldDialog = ({
	open,
	onClose,
	addFieldAction,
}: AddFieldDialogProps) => {
	const [fieldType, setFieldType] = React.useState<
		"string" | "number" | "select" | "checkbox"
	>("string");
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const newField: NewFieldType = {
			fieldName: formData.get("fieldName") as string,
			filler: formData.get("fieldTypeSelect") as FillerType,
			type: formData.get("fieldDataTypeSelect") as SupportedFieldTypes,
			disabled: (formData.get("fieldTypeSelect") as FillerType) === "system",
			required: formData.get("fieldMandatory") === "on",
		};

		addFieldAction(newField);
		onClose();
	};
	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose}>
			<DialogTitle>Add a New Field</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Grid container spacing={1}>
						<Grid size={{ xs: 12, md: 6 }}>
							<Typography mr={1}>Enter Field Name:</Typography>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<TextField name="fieldName" fullWidth />
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Typography mr={1}>Select Field Type:</Typography>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Select id="fieldTypeSelect" name="fieldType" fullWidth>
								<MenuItem value={"system"}>Pre-Filled</MenuItem>
								<MenuItem value={"admin"}>Admin</MenuItem>
								<MenuItem value={"user"}>User</MenuItem>
								<MenuItem value={"consumer"}>Consumer</MenuItem>
							</Select>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Typography mr={1}>Mandatory Field?</Typography>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Checkbox
								id="fieldMandatory"
								name="fieldMandatory"
								defaultChecked
							/>
						</Grid>

						<Grid size={{ xs: 12, md: 6 }}>
							<Typography mr={1}>Select Data Type:</Typography>
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<Select
								id="fieldDataTypeSelect"
								name="fieldDataTypeSelect"
								fullWidth
								onChange={(e) => {
									setFieldType(
										e.target.value as
											| "string"
											| "number"
											| "select"
											| "checkbox"
									);
								}}
							>
								<MenuItem value={"string"}>String</MenuItem>
								<MenuItem value={"number"}>Number</MenuItem>
								<MenuItem value={"checkbox"}>Checkbox</MenuItem>
								<MenuItem value={"select"}>select</MenuItem>
							</Select>
						</Grid>
						<Fade in={fieldType === "select"} timeout={2000} unmountOnExit>
							<React.Fragment>
								<Grid size={{ xs: 12, md: 6 }}>
									<Typography mr={1}>Enter Possible Values:</Typography>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<TextField
										name="options"
										placeholder="Comma Separate Values"
										fullWidth
									/>
								</Grid>
							</React.Fragment>
						</Fade>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="error" onClick={onClose} variant="contained">
						Cancel
					</Button>
					<Button color="success" variant="contained" type="submit">
						Add Field
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default AddFieldDialog;
