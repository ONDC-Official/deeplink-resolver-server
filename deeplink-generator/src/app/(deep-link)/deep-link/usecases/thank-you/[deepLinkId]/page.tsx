import {
	CustomContainedButtom,
	DeepLinkCopyBox,
	DownloadQr,
	SocialsList,
} from "@/app/components";
import { Paper, Typography, Grid2 as Grid, Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import Divider, { dividerClasses } from '@mui/material/Divider';

const DeepLinkThankYouPage = async ({
	params,
}: {
	params: Promise<{ deepLinkId: string }>;
}) => {
	const deepLinkId = (await params).deepLinkId;
	return (
		<Paper
			sx={{
				p: 2,
				borderColor: "primary.light",
				borderWidth: 2,
				borderStyle: "solid",
				borderRadius: 2,
				my: 4,
				height: "100%",
				padding: "20px",
				marginTop: "7%"
			}}
		>
			<Typography variant="h4" color="primary" align="center" fontWeight="900" my={3}>
				Thank You for using ONDC, here&apos;s your deep link!
			</Typography>
			<DeepLinkCopyBox deepLink={`beckn://github.ondc.ret10/${deepLinkId}`} />
			<Grid container spacing={2}>
				<Grid size={{ xs: 12 }}>
					<Box sx={{ display: "flex", justifyContent: "center", marginTop: "30px", marginBottom: "30px", py:2 }}>	
						<Link href="/">
							<CustomContainedButtom>Back To Home </CustomContainedButtom>
						</Link>
					</Box>
				</Grid>
				<Grid size={{ xs: 12, md: 5 }}>
					<DownloadQr link={`beckn://github.ondc.ret10/${deepLinkId}`}/>
				</Grid>
				<Divider orientation="vertical" variant="middle" flexItem />
				<Grid size={{ xs: 12, md: 6 }}>
					<SocialsList />
				</Grid>
			</Grid>
		</Paper>
	);
};

export default DeepLinkThankYouPage;
