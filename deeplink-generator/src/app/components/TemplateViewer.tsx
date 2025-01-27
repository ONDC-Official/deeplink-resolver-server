"use client";
import { Box } from "@mui/material";
import { JsonValue } from "@prisma/client/runtime/library";
import { JsonEditor } from "json-edit-react";
import React from "react";

type TemplateViewerProps = {
	template: JsonValue;
};

export const TemplateViewer = ({ template }: TemplateViewerProps) => {
	return (
		<Box sx={{ width: "100%" }}>
			<JsonEditor data={template!} enableClipboard restrictEdit />
		</Box>
	);
};
