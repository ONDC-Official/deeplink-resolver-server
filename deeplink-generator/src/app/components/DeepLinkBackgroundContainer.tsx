"use client";
import { Container, Box } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
import { useAppTheme } from "../hooks";

export const DeepLinkBackgroundContainer: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const { mode } = useAppTheme();
	const Background = styled(Box)(() => ({
		backgroundImage: `url(${
			mode === "light" ? "/background.jpg" : "/background_inverted.jpg"
		})`,
		backgroundSize: "cover",
		backgroundPosition: "center",
		minHeight: "100vh",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	}));
	return (
		<Background>
			<Container
				sx={{
					minHeight: "100vh",
					display: "flex",
					justifyContent: "flex-start",
					alignItems: "center",
					flexDirection: "column",
				}}
			>
				{children}
			</Container>
		</Background>
	);
};
