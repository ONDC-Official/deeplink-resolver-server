"use client";
import { Box, Button, IconButton, Paper, TextField } from "@mui/material";
import React, { useState } from "react";
import {
	ComponentableSchema,
	formDataToFormItemArray,
	fromComponentableToJSONSchema,
	fromJSONSchemaToComponentable,
	JsonSchemaObject,
} from "@/app/utils";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import AddFieldDialog, { NewFieldType } from "@/app/components/AddFieldDialog";
import { DeleteTwoTone } from "@mui/icons-material";
import Form from "next/form";
import { createTemplate } from "../actions";
import { FieldName } from "./FieldName";
import { Template } from "@prisma/client";
import { useRouter } from "next/router";

type TemplateCreatorProps = {
	template: Template;
};

export const TemplateCreator = ({ template }: TemplateCreatorProps) => {
	const router = useRouter();
	const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);

	const [templateValue, setTemplateValue] = useState<
		Record<string, ComponentableSchema>
	>(
		template
			? fromJSONSchemaToComponentable(template!.value as JsonSchemaObject)
			: {}
	);

	const handleTemplateFieldAddition = (newField: NewFieldType) => {
		const { fieldName, ...field } = newField;
		setOpenAddFieldDialog(false);
		setTemplateValue((prev) => ({ ...prev, [fieldName]: field }));
	};

	const handleDeleteField = (fieldName: string) => {
		setTemplateValue((prev) => {
			const updatedValue = { ...prev };
			delete updatedValue[fieldName];
			return updatedValue;
		});
	};

	const handleFormSubmit = async (formData: FormData) => {
		const formItems = formDataToFormItemArray(formData);
		const schema = fromComponentableToJSONSchema(
			formItems.reduce((acc, curr) => ({ ...acc, ...curr }), {}) as {
				[key: string]: ComponentableSchema;
			}
		);
		const response = await createTemplate(schema);
		router.push(`/template/2/${response.id}`);
	};
	return (
		<>
			<Form
				action={handleFormSubmit}
				formMethod="POST"
				style={{ width: "100%" }}
			>
				<Paper elevation={4} sx={{ width: "100%", p: 2 }}>
					{Object.keys(templateValue).map((key: string) => (
						<Box
							sx={{ display: "flex", alignItems: "center", my: 2 }}
							key={key}
						>
							<FieldName fieldName={key} />:{" "}
							<TextField
								disabled
								sx={{ ml: 1 }}
								name={key}
								value={templateValue[key]}
							/>
							<IconButton
								title="Remove Field"
								onClick={() => handleDeleteField(key)}
							>
								<DeleteTwoTone color="error" />
							</IconButton>
						</Box>
					))}
					<Box sx={{ display: "flex", justifyContent: "Center" }}>
						<Button
							variant="contained"
							sx={{ my: 3 }}
							endIcon={<AddCircleTwoToneIcon />}
							color="info"
							onClick={() => setOpenAddFieldDialog(true)}
						>
							Add Field
						</Button>
					</Box>
				</Paper>
				<Button variant="contained" sx={{ my: 3 }} type="submit">
					Next
				</Button>
			</Form>
			<AddFieldDialog
				open={openAddFieldDialog}
				onClose={() => setOpenAddFieldDialog(false)}
				addFieldAction={handleTemplateFieldAddition}
			/>
		</>
	);
};
