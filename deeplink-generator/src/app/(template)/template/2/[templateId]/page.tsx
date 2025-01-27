import React from "react";
import template from "@/app/assets/template.json";
import { redirect } from "next/navigation";
import { getTemplateById } from "@/app/actions";
import { CustomHeading, TemplateCreator } from "@/app/components";
import { Template } from "@prisma/client";

const ExtendTemplatePage = async ({
	params,
}: {
	params: Promise<{ templateId: string }>;
}) => {
	const templateId = (await params).templateId;
	if (!templateId) redirect("/");
	let templateToUse;
	if (templateId === "scratch") {
		templateToUse = template;
	} else {
		templateToUse = await getTemplateById(templateId);
	}

	return (
		<>
			<CustomHeading heading="Customize Template" />
			<TemplateCreator template={templateToUse! as Template} />
		</>
	);
};

export default ExtendTemplatePage;
