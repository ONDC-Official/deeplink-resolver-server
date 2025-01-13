import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function readJsonFiles() {
	const currentDir = path.join(process.cwd(), "seeding");
	console.log("CWD", currentDir);
	const files = fs
		.readdirSync(currentDir)
		.filter((file) => file.endsWith(".json"));

	const jsonDataArray = files.map((file) => {
		const filePath = path.join(currentDir, file);
		const fileContent = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(fileContent);
	});

	return jsonDataArray;
}

async function main() {
	const filesData = await readJsonFiles();
	// console.log(filesData)
	const categorySubcategoryMap = {};
	filesData.forEach(async (file) => {
		const { category, subCategory } = file;
		if (categorySubcategoryMap[category]) {
			categorySubcategoryMap[category].push(subCategory);
		} else {
			categorySubcategoryMap[category] = [subCategory];
		}
	});
	console.log(categorySubcategoryMap);
	const createdCategories = await Promise.all(
		Object.keys(categorySubcategoryMap).map((category) =>
			prisma.usecaseCategory.create({
				data: {
					name: category,
					UsecaseSubcategory: {
						createMany: {
							data: categorySubcategoryMap[category].map((name) => ({
								name,
							})),
						},
					},
				},
				include: {
					UsecaseSubcategory: true,
				}
			})
		)
	);
	console.log("Seeded Categories", createdCategories);

	const seededCategories = await prisma.usecaseCategory.findMany();
	const seededSubCategories = await prisma.usecaseSubcategory.findMany();

	console.log("Seeded Categories", seededCategories);
	console.log("Seeded SubCategories", seededSubCategories);

	const processedData = filesData.map((file) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { category, subCategory, ...remainingFile } = file;
		console.log(
			"FILTERED category",
			file.category.toLowerCase(),
			seededCategories.filter(
				(category) =>
					category.name.toLowerCase() === file.category.toLowerCase()
			)[0].id
		);

		console.log(
			"FILTERED sub-category",
			file.subCategory.toLowerCase(),
			seededCategories.filter(
				(category) =>
					category.name.toLowerCase() === file.category.toLowerCase()
			)[0].id
		);

		return {
			...remainingFile,
			usecaseCategoryId: seededCategories.filter(
				(category) =>
					category.name.toLowerCase() === file.category.toLowerCase()
			)[0].id,
			usecaseSubcategoryId: seededSubCategories.filter(
				(subCategory) =>
					subCategory.name.toLowerCase() === file.subCategory.toLowerCase()
			)[0].id,
		};
	});
	await prisma.template.createMany({
		data: processedData,
	});
	// const template = await prisma.template.create({
	// 	data: {
	// 		name: "Retail - Search By City",
	// 		description: "This is an example template",
	// 		value: {
	// 			context: {
	// 				domain: {
	// 					type: "string",
	// 					filler: "user",
	// 					enum: ["ONDC:RET10", "ONDC:RET11", "ONDC:RET13"],
	// 				},
	// 				action: "search",
	// 				country: { filler: "pg", type: "string" },
	// 				city: { filler: "pg", type: "string" },
	// 				core_version: "1.2.0",
	// 				bap_id: { filler: "pg", type: "string" },
	// 				bap_uri: { filler: "pg", type: "string" },
	// 				transaction_id: { filler: "pg", type: "string" },
	// 				message_id: { filler: "pg", type: "string" },
	// 				timestamp: { filler: "pg", type: "string" },
	// 				ttl: "PT30S",
	// 			},
	// 			message: {
	// 				intent: {
	// 					item: {
	// 						descriptor: {
	// 							name: { filler: "user", type: "string" },
	// 						},
	// 					},
	// 					fulfillment: {
	// 						type: "Delivery",
	// 						end: {
	// 							location: {
	// 								gps: { filler: "pg", type: "string" },
	// 								address: {
	// 									area_code: { filler: "pg", type: "string" },
	// 								},
	// 							},
	// 						},
	// 					},
	// 				},
	// 			},
	// 		},
	// 		templateStage: "SUBMITTED",
	// 		category: {
	// 			connect: {
	// 				name: "Retail",
	// 			},
	// 		},
	// 		subCategory: {
	// 			connect: {
	// 				name: "Search By City",
	// 			},
	// 		},
	// 	},
	// });

	// const usecase = await prisma.usecase.create({
	// 	data: {
	// 		name: "Example Usecase",
	// 		usecaseStage: "SUBMITTED",
	// 		templateId: template.id,
	// 		value: {
	// 			context: {
	// 				domain: "ONDC:RET10",
	// 				action: "search",
	// 				country: { filler: "pg", type: "string" },
	// 				city: { filler: "pg", type: "string" },
	// 				core_version: "1.2.0",
	// 				bap_id: { filler: "pg", type: "string" },
	// 				bap_uri: { filler: "pg", type: "string" },
	// 				transaction_id: { filler: "pg", type: "string" },
	// 				message_id: { filler: "pg", type: "string" },
	// 				timestamp: { filler: "pg", type: "string" },
	// 				ttl: "PT30S",
	// 			},
	// 			message: {
	// 				intent: {
	// 					item: {
	// 						descriptor: {
	// 							name: "XYZ-item-name",
	// 						},
	// 					},
	// 					fulfillment: {
	// 						type: "Delivery",
	// 						end: {
	// 							location: {
	// 								gps: { filler: "pg", type: "string" },
	// 								address: {
	// 									area_code: { filler: "pg", type: "string" },
	// 								},
	// 							},
	// 						},
	// 					},
	// 					payment: {
	// 						"@ondc/org/buyer_app_finder_fee_type": "percent",
	// 						"@ondc/org/buyer_app_finder_fee_amount": "0",
	// 					},
	// 					tags: [
	// 						{
	// 							code: "source_id",
	// 							value: "3a87b1c8-9d07-474b-ab25-9909735ecbef", // auto generated when deeplink is created
	// 						},
	// 					],
	// 				},
	// 			},
	// 		},
	// 	},
	// });
	// console.log("Seeded Template", template);
	// console.log("Seeded Usecase", usecase);
}
main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
