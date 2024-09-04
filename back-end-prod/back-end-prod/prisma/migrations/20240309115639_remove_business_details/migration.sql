/*
  Warnings:

  - You are about to drop the `BusinessDetails` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `businessOverview` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_type` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entity_type` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `established_date` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry_type` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isStartup` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listing_type` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_name` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BusinessDetails" DROP CONSTRAINT "BusinessDetails_listing_id_fkey";

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "businessOverview" TEXT NOT NULL,
ADD COLUMN     "business_type" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "entity_type" TEXT NOT NULL,
ADD COLUMN     "established_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "industry_type" TEXT NOT NULL,
ADD COLUMN     "isStartup" BOOLEAN NOT NULL,
ADD COLUMN     "listing_type" TEXT NOT NULL,
ADD COLUMN     "organization_name" TEXT NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "BusinessDetails";
