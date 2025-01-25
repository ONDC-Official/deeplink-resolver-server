import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Button,
	Paper,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";

// import template from "@/app/assets/template.json";
import { getAllTemplates } from "@/app/actions";
import { redirect } from "next/navigation";
import { CustomHeading, TemplateViewer } from "@/app/components";

const SelectBaseTemplatePage = async () => {
	const templates = await getAllTemplates();
	if (templates.length === 0) {
		redirect("/template/2/scratch");
	}
	const handleTemplateSelection = async (form: FormData) => {
		"use server";
		redirect(`/template/2/${form.get("templateId")}`);
	};
	return (
		<>
			<CustomHeading heading="Select Base Template" />

			<form action={handleTemplateSelection} style={{ width: "100%" }}>
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
					<TextField fullWidth title="Search Templates" />
					<RadioGroup name="templateId" defaultValue={templates[0].id}>
						{templates.map((template) => (
							<Box
								key={template.id}
								sx={{
									my: 1,
									width: "100%",
									display: "flex",
									justifyContent: "flex-start",
									alignItems: "center",
								}}
							>
								<Radio value={template.id} required />
								<Accordion sx={{ ml: 1, width: "100%" }}>
									<AccordionSummary>
										<Typography>Usecase: {template.name}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<TemplateViewer template={template.value} />
										<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
											<Button
												variant="contained"
												sx={{ textTransform: "none" }}
											>
												Verify
											</Button>
										</Box>
									</AccordionDetails>
								</Accordion>
							</Box>
						))}
					</RadioGroup>
				</Paper>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						alignItems: "center",
					}}
				>
					<Button variant="contained" type="submit">
						Next
					</Button>
				</Box>
			</form>
		</>
	);
};

export default SelectBaseTemplatePage;
