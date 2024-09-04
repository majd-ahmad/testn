/*
  Warnings:

  - You are about to drop the column `last_year_profit` on the `Financials` table. All the data in the column will be lost.
  - You are about to drop the column `last_year_revenue` on the `Financials` table. All the data in the column will be lost.
  - You are about to drop the column `last_year_sales` on the `Financials` table. All the data in the column will be lost.
  - You are about to drop the column `listing_id` on the `Financials` table. All the data in the column will be lost.
  - You are about to drop the column `deal_type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `entity_type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `established_date` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `industry_type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `organisation_name` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `ListingPdf` table. All the data in the column will be lost.
  - You are about to drop the column `files_size` on the `ListingPdf` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `ListingPhoto` table. All the data in the column will be lost.
  - You are about to drop the column `files_size` on the `ListingPhoto` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId]` on the table `Financials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastYearProfit` to the `Financials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastYearRevenue` to the `Financials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastYearSales` to the `Financials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listingId` to the `Financials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityType` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishedDate` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industryType` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `ListingPdf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `ListingPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Financials" DROP CONSTRAINT "Financials_listing_id_fkey";

-- DropIndex
DROP INDEX "Financials_listing_id_key";

-- AlterTable
ALTER TABLE "Financials" DROP COLUMN "last_year_profit",
DROP COLUMN "last_year_revenue",
DROP COLUMN "last_year_sales",
DROP COLUMN "listing_id",
ADD COLUMN     "lastYearProfit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "lastYearRevenue" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "lastYearSales" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "listingId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "deal_type",
DROP COLUMN "entity_type",
DROP COLUMN "established_date",
DROP COLUMN "industry_type",
DROP COLUMN "organisation_name",
ADD COLUMN     "dealType" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "entityType" TEXT NOT NULL,
ADD COLUMN     "establishedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "industryType" TEXT NOT NULL,
ADD COLUMN     "organisationName" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ListingPdf" DROP COLUMN "file_name",
DROP COLUMN "files_size",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filesSize" INTEGER;

-- AlterTable
ALTER TABLE "ListingPhoto" DROP COLUMN "file_name",
DROP COLUMN "files_size",
ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "filesSize" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Financials_listingId_key" ON "Financials"("listingId");

-- AddForeignKey
ALTER TABLE "Financials" ADD CONSTRAINT "Financials_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
