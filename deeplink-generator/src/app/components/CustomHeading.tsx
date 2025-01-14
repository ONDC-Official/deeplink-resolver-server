import { Box, Breadcrumbs, Paper, Stack, Typography } from "@mui/material";
import { Box, Breadcrumbs, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { ThemeTogglerButton } from "./ThemeTogglerButton";
import Link from "next/link";
type CustomHeadingProps = {
	heading: string;
	breadcrumb?: Array<{
		name: string;
		link: string;
	}>;
};

export const CustomHeading = ({ heading, breadcrumb }: CustomHeadingProps) => {
	return (
		<Paper sx={{ bgcolor: "primary.main", p: 2, width: "100%", my: 1 }}>
			{breadcrumb && (
				<Breadcrumbs>
					{breadcrumb.map((each, index) => (
						<Link
							href={each.link}
							key={each.name + index}
							style={{ textDecoration: "none" }}
						>
							<Typography variant="subtitle2" fontWeight={700} color="white">
								{each.name}
							</Typography>
						</Link>
					))}
					<Typography variant="subtitle1" fontWeight={800} color="white">
						{heading}
					</Typography>
				</Breadcrumbs>
			)}

			<Stack justifyContent="space-between" alignItems="center" direction="row">
				<Typography variant="h4" fontWeight={900}>
					{heading}
				</Typography>
				<ThemeTogglerButton />
			</Stack>
		</Paper>
	);
};
