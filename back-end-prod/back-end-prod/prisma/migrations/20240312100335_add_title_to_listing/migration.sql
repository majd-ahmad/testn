/*
  Warnings:

  - You are about to drop the column `organization_name` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "organization_name",
ADD COLUMN     "organisation_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';
