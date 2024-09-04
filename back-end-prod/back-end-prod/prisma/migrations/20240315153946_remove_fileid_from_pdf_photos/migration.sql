/*
  Warnings:

  - You are about to drop the column `file_id` on the `ListingPdf` table. All the data in the column will be lost.
  - You are about to drop the column `file_id` on the `ListingPhoto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ListingPdf_file_id_key";

-- DropIndex
DROP INDEX "ListingPhoto_file_id_key";

-- AlterTable
ALTER TABLE "ListingPdf" DROP COLUMN "file_id";

-- AlterTable
ALTER TABLE "ListingPhoto" DROP COLUMN "file_id";
