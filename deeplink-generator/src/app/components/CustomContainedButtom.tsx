import {
	ButtonBase,
	ButtonProps,
	Paper,
	PaperProps,
	Typography,
} from "@mui/material";
import React from "react";

type CustomContainedButtomProps = {
	children: React.ReactNode;
	buttonBaseProps?: ButtonProps;
	paperProps?: PaperProps;
};

export const CustomContainedButtom = ({
	children,
	buttonBaseProps,
	paperProps,
}: CustomContainedButtomProps) => {
	return (
		<ButtonBase {...buttonBaseProps}>
			<Paper
				elevation={2}
				sx={{
					px: 2,
					py: 1,
					bgcolor: "primary.light",
					color: "white",
					transition: "all 0.2s ease-in-out",
					"&:hover": {
						bgcolor: "primary.dark",
						elevation: 4,
					},
				}}
				{...paperProps}
			>
				<Typography variant="h4">{children}</Typography>
			</Paper>
		</ButtonBase>
	);
};
