/*
  Warnings:

  - You are about to drop the column `organisationName` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "organisationName",
ADD COLUMN     "organizationName" TEXT NOT NULL DEFAULT '';
