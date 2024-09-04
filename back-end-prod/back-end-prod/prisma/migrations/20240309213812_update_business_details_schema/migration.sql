/*
  Warnings:

  - You are about to drop the column `listing_type` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "listing_type",
DROP COLUMN "title";
