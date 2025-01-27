import { Paper, SxProps, Typography } from "@mui/material";
import React from "react";
type FieldNameProps = {
	fieldName: string;
	paperSx?: SxProps;
	paperProps?: React.ComponentProps<typeof Typography>;
	typographySx?: SxProps;
	typographyProps?: React.ComponentProps<typeof Typography>;
};

export const FieldName = ({
	fieldName,
	paperSx,
	typographySx,
}: FieldNameProps) => {
	return (
		<Paper
			sx={{
				p: 2,
				borderColor: "primary.light",
				borderWidth: 2,
				borderStyle: "solid",
				borderRadius: 2,
				width: "30%",

				...paperSx,
			}}
		>
			<Typography
				color="primary.light"
				sx={{
					":hover": {
						scale: 1.02,
						transition: "all 0.3s ease-in-out",
					},
					...typographySx,
				}}
				noWrap
				title={fieldName}
			>
				{fieldName}
			</Typography>
		</Paper>
	);
};
