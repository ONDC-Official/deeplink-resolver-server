"use client";
import { DownloadTwoTone } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";

type DownloadQrProps = {
	usecaseId: string;
	name: string
};

export const DownloadQr = ({ usecaseId, name}: DownloadQrProps) => {
	const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/usecase/pdf/${usecaseId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert('Error generating PDF');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error generating PDF');
    }
  };
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "flex-start",
				py: 2,
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<Typography variant="h6" align="center" color="primary.light" marginBottom={"10px"} mb={2}>
				Download QR
			</Typography>
			<IconButton
				size="medium"
				sx={{
					color: "white",
					bgcolor: "primary.light",
					"&:hover": { bgcolor: "primary.dark" },
				}}
				onClick={handleDownloadPDF}
			>
				<DownloadTwoTone />
			</IconButton>
		</Box>
	);
};
