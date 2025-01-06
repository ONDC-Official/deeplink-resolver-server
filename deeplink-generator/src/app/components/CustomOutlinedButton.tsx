import { ButtonBase, colors, Paper, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
type CustomOutlinedButtonProps = {
	label: string;
	href: string;
};
export const CustomOutlinedButton = ({
	label,
	href,
}: CustomOutlinedButtonProps) => {
	return (
		<Link href={href}>
		<ButtonBase sx={{ width: "100%" }}>
			<Paper
				elevation={3}
				sx={{
					p: 2,
					borderColor: "primary.light",
					borderWidth: 2.5,
					borderStyle: "solid",
					borderRadius: 2,
					bgcolor: "transparent",
					width: "100%",
					"&:hover": {
						transform: 'scale(1.04)',
						bgcolor: colors.grey[100],
						borderColor: "primary.dark",
						color: colors.grey[900],
					}
				}}
			>
				<Typography variant="body2">{label}</Typography>
			</Paper>
		</ButtonBase>
		</Link>
	);
};
