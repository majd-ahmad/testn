-- DropForeignKey
ALTER TABLE "Financials" DROP CONSTRAINT "Financials_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ListingPdf" DROP CONSTRAINT "ListingPdf_listingId_fkey";

-- DropForeignKey
ALTER TABLE "ListingPhoto" DROP CONSTRAINT "ListingPhoto_listingId_fkey";

-- AddForeignKey
ALTER TABLE "Financials" ADD CONSTRAINT "Financials_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPhoto" ADD CONSTRAINT "ListingPhoto_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPdf" ADD CONSTRAINT "ListingPdf_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
