/*
  Warnings:

  - You are about to drop the `ListingFiles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `file_name` to the `ListingPdf` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `ListingPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ListingPdf" DROP CONSTRAINT "ListingPdf_file_id_fkey";

-- DropForeignKey
ALTER TABLE "ListingPhoto" DROP CONSTRAINT "ListingPhoto_file_id_fkey";

-- AlterTable
ALTER TABLE "ListingPdf" ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "files_size" INTEGER,
ADD COLUMN     "listingId" TEXT,
ADD COLUMN     "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ListingPhoto" ADD COLUMN     "file_name" TEXT NOT NULL,
ADD COLUMN     "files_size" INTEGER,
ADD COLUMN     "listingId" TEXT,
ADD COLUMN     "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ListingFiles";

-- AddForeignKey
ALTER TABLE "ListingPhoto" ADD CONSTRAINT "ListingPhoto_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPdf" ADD CONSTRAINT "ListingPdf_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
