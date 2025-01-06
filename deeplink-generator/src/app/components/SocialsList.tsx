import { Box, Grid2 as Grid, Typography, IconButton } from "@mui/material";
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PinterestIcon from "@mui/icons-material/Pinterest";
import GroupsIcon from "@mui/icons-material/Groups";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

export const SocialsList = () => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				py: 2,
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Typography
				variant="h6"
				color="primary.light"
				align="center"
				marginBottom={"10px"}
				gutterBottom
			>
				Share directly on Socials
			</Typography>
			<Grid container spacing={2} justifyContent="center">
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton color="primary">
						<EmailIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton color="success">
						<WhatsAppIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton color="secondary">
						<GroupsIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton sx={{ color: "#E60023" }}>
						<PinterestIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton sx={{ color: "#E1306C" }}>
						<InstagramIcon fontSize="large" />
					</IconButton>
				</Grid>
				<Grid size={{xs: 6, md:3, lg:2}}>
					<IconButton sx={{ color: "#1877F2" }}>
						<FacebookIcon fontSize="large" />
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};
