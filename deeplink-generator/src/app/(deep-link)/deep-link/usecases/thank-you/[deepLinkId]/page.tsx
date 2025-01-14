import {
	CustomContainedButtom,
	DeepLinkCopyBox,
	DownloadQr,
	SocialsList,
} from "@/app/components";
import { Paper, Typography, Grid2 as Grid, Box } from "@mui/material";
import Link from "next/link";
import React from "react";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import { getUsecaseById } from "@/app/actions";
import { redirect } from "next/navigation";

const DeepLinkThankYouPage = async ({
	params,
}: {
	params: Promise<{ deepLinkId: string }>;
}) => {
	const deepLinkId = (await params).deepLinkId;
	const usecase = await getUsecaseById(deepLinkId);
	if (!usecase) {
		redirect("/");
	}
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
				marginTop: "7%",
			}}
		>
			<Typography
				variant="h4"
				color="primary"
				align="center"
				fontWeight="900"
				my={3}
			>
				Thank You for using ONDC, here&apos;s your deep link!
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					":hover": {
						scale: 1.02,
						transition: "all 0.2s ease-in-out",
					},
				}}
			>
				<Image
					src={`https://raw.githubusercontent.com/${process.env.OWNER_NAME_REPO}/${process.env.STORAGE_REPO_NAME}/refs/heads/master/deep-link-payload/qr/${deepLinkId}.png`}
					alt="QR"
					height={250}
					width={250}
				/>
			</Box>

			<DeepLinkCopyBox deepLink={usecase.usecaseDeepLink!} />
			<Grid container spacing={2}>
				<Grid size={{ xs: 12 }}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							marginTop: "30px",
							marginBottom: "30px",
							py: 2,
						}}
					>
						<Link href="/">
							<CustomContainedButtom>Back To Home </CustomContainedButtom>
						</Link>
					</Box>
				</Grid>
				<Grid size={{ xs: 12, md: 5 }}>
					<DownloadQr usecaseId={deepLinkId} name={usecase.name!} />
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
