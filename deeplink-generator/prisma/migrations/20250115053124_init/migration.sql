-- CreateEnum
CREATE TYPE "TemplateStage" AS ENUM ('DRAFT', 'REVIEW', 'SUBMITTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "UsecaseStage" AS ENUM ('DRAFT', 'REVIEW', 'SUBMITTED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL DEFAULT substr(gen_random_uuid()::text, 1, 16),
    "name" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" JSONB NOT NULL,
    "templateStage" "TemplateStage" NOT NULL,
    "usecaseCategoryId" TEXT,
    "usecaseSubcategoryId" TEXT,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usecase" (
    "id" TEXT NOT NULL DEFAULT substr(gen_random_uuid()::text, 1, 16),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" JSONB NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "creatorName" TEXT,
    "qrPdfLink" TEXT,
    "usecaseDeepLink" TEXT,
    "usecaseStage" "UsecaseStage" NOT NULL,

    CONSTRAINT "Usecase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsecaseCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UsecaseCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsecaseSubcategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "usecaseCategoryId" TEXT NOT NULL,

    CONSTRAINT "UsecaseSubcategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Template_usecaseCategoryId_usecaseSubcategoryId_idx" ON "Template"("usecaseCategoryId", "usecaseSubcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Template_usecaseCategoryId_usecaseSubcategoryId_key" ON "Template"("usecaseCategoryId", "usecaseSubcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "UsecaseCategory_name_key" ON "UsecaseCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UsecaseSubcategory_name_key" ON "UsecaseSubcategory"("name");

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_usecaseCategoryId_fkey" FOREIGN KEY ("usecaseCategoryId") REFERENCES "UsecaseCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_usecaseSubcategoryId_fkey" FOREIGN KEY ("usecaseSubcategoryId") REFERENCES "UsecaseSubcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usecase" ADD CONSTRAINT "Usecase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsecaseSubcategory" ADD CONSTRAINT "UsecaseSubcategory_usecaseCategoryId_fkey" FOREIGN KEY ("usecaseCategoryId") REFERENCES "UsecaseCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
