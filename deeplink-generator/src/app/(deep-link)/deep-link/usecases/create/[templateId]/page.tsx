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
import { createUsecase, getTemplateById } from "@/app/actions";
import {
  CustomContainedButtom,
  CustomHeading,
  FieldName,
} from "@/app/components";
import { redirect } from "next/navigation";
const GenerateDeepLinkPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ templateId: string }>;
  searchParams: Promise<{ category: string; subcategory: string }>;
}) => {
  const templateId = (await params).templateId;
  const { category } = await searchParams;
  const template = await getTemplateById(templateId);
  const templateValue = flattenTemplate(template!.value);
  const handleSubmit = async (form: FormData) => {
    "use server";
    const value = formDataToFormItemArray(form);
    let valid = true;
    value.forEach((item) => {
      if (item.value.startsWith("{{") || item.value.endsWith("}}")) {
        valid = false;
        throw alert(`Invalid Input`);
      }
    });

    if (valid) {
      const deepLink = await createUsecase({
        templateId,
        value: value.map(({ name, value }) => {
          try {
            const v = JSON.parse(value);
            if (typeof v !== "object") {
              throw new Error("Primitive values as strings are not allowed");
            }
            return { name, value: `{{${name}}}` };
          } catch {
            return { name, value };
          }
        }),
      });

      redirect(
        `/deep-link/usecases/publish/${deepLink.id}?templateId=${templateId}`
      );
    }
  };
  return (
    <>
      <CustomHeading
        heading="DEEP LINK GENERATOR"
        breadcrumb={[
          { name: "Home", link: "/" },
          { name: "Usecases Categories", link: `/deep-link` },
          {
            name: "Usecases Subcategories",
            link: `/deep-link/filter/${category}`,
          },
        ]}
      />
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
                      required
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
                      required
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
          <CustomContainedButtom
            buttonBaseProps={{
              type: "submit",
            }}
          >
            Submit
          </CustomContainedButtom>
        </Box>
      </Form>
    </>
  );
};

export default GenerateDeepLinkPage;
