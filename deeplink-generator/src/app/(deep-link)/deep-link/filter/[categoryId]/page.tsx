import { getUsecaseCategories, getUsecaseSubcategories } from "@/app/actions";
import { CustomHeading, CustomOutlinedButton } from "@/app/components";
// import { formatToNormalCasing } from "@/app/utils";
import { Grid2 as Grid, Paper, Typography } from "@mui/material";
import { UsecaseCategory } from "@prisma/client";
import React from "react";

export const revalidate = 3600;
export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
	const posts: UsecaseCategory[] = await getUsecaseCategories();
	return posts.map((post) => ({
		id: String(post.id),
	}));
}

const SelectUsecaseSubcategory = async ({
	params,
}: {
	params: Promise<{ categoryId: string }>;
}) => {
	const categoryId = (await params).categoryId;
	const subcategories = await getUsecaseSubcategories(categoryId);
	return (
		<>
			<CustomHeading
				heading="USECASE SUBCATEGORIES"
				breadcrumb={[
					{ name: "Home", link: "/" },
					{ name: "Usecase Categories", link: `/deep-link` },
				]}
			/>

			<Paper
				elevation={3}
				sx={{
					p: 2,
					borderColor: "primary.light",
					borderWidth: 2,
					borderStyle: "solid",
					borderRadius: 2,
					mt: 2,
					width: "100%",
				}}
			>
				{subcategories.length === 0 ? (
					<Typography>No subcategories found for this category</Typography>
				) : (
					<Grid container spacing={2}>
						{subcategories.map((subcategory, index) => (
							<Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
								<CustomOutlinedButton
									href={`/deep-link/usecases/browse?category=${categoryId}&subcategory=${subcategory.id}`}
									// label={formatToNormalCasing(subcategory.name)}
									label={subcategory.name}
								/>
							</Grid>
						))}
					</Grid>
				)}
			</Paper>
		</>
	);
};

export default SelectUsecaseSubcategory;
