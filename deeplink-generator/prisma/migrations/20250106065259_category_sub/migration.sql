/*
  Warnings:

  - Added the required column `usecaseCategoryId` to the `UsecaseSubcategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" ALTER COLUMN "id" SET DEFAULT substr(gen_random_uuid()::text, 1, 16);

-- AlterTable
ALTER TABLE "Usecase" ALTER COLUMN "id" SET DEFAULT substr(gen_random_uuid()::text, 1, 16);

-- AlterTable
ALTER TABLE "UsecaseSubcategory" ADD COLUMN     "usecaseCategoryId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UsecaseSubcategory" ADD CONSTRAINT "UsecaseSubcategory_usecaseCategoryId_fkey" FOREIGN KEY ("usecaseCategoryId") REFERENCES "UsecaseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
