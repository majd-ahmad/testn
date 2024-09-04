/*
  Warnings:

  - A unique constraint covering the columns `[listingId]` on the table `ListingApprovalToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ListingApprovalToken" ALTER COLUMN "deleted" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "ListingApprovalToken_listingId_key" ON "ListingApprovalToken"("listingId");
