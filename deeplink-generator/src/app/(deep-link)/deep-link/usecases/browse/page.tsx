import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";

import { getTemplateByCategoryAndSubcategory } from "@/app/actions";
import { CustomContainedButtom, CustomHeading } from "@/app/components";
import { redirect } from "next/navigation";
import Form from "next/form";
import Link from "next/link";
import { Template } from "@prisma/client";

const SelectUsecasePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ category: string; subcategory: string }>;
}) => {
  const { category, subcategory } = await searchParams;
  const templates = await getTemplateByCategoryAndSubcategory(
    category,
    subcategory
  );

  if (!Array.isArray(templates))
    redirect(`/deep-link/usecases/create/${(templates as Template).id}`);

  const handleSelection = async (form: FormData) => {
    "use server";
    redirect(
      `/deep-link/usecases/create/${form.get(
        "templateId"
      )}?category=${category}&subcategory=${subcategory}`
    );
  };

  return (
    <>
      <Toolbar />
      <CustomHeading
        heading="Select Template"
        breadcrumb={[{ name: "Home", link: "/" }]}
      />
      <Toolbar />
      {Array.isArray(templates) && templates.length > 0 ? (
        <Form action={handleSelection}>
          <TextField
            fullWidth
            title="Search Templates"
            placeholder="Search Templates..."
          />
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
                    <Typography>
                      {JSON.stringify(template.value, undefined, 2)}
                    </Typography>
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <CustomContainedButtom
              buttonBaseProps={{
                type: "submit",
                disabled: templates.length === 0,
              }}
            >
              Create Usecase
            </CustomContainedButtom>
          </Box>
        </Form>
      ) : (
        <>
          <Typography variant="body2" mb={3}>
            There are not templates defined for this category and sub category
            currently.
          </Typography>
          <Link href="/">
            <CustomContainedButtom>Back to Home</CustomContainedButtom>
          </Link>
        </>
      )}
    </>
  );
};

export default SelectUsecasePage;
