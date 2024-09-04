/*
  Warnings:

  - You are about to drop the column `business_type` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "business_type",
ADD COLUMN     "deal_type" TEXT NOT NULL DEFAULT '';
