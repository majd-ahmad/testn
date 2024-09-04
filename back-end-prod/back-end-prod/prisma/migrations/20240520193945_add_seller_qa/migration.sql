-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "aboutBusiness" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "assetOverview" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "SellerQnA" (
    "id" TEXT NOT NULL,
    "uniqueValueProposition" VARCHAR(500),
    "keyProductsOrServices" VARCHAR(500),
    "intellectualProperty" VARCHAR(500),
    "legalIssues" VARCHAR(500),
    "challengesOrRisks" VARCHAR(500),
    "listingId" TEXT NOT NULL,

    CONSTRAINT "SellerQnA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SellerQnA_listingId_key" ON "SellerQnA"("listingId");

-- AddForeignKey
ALTER TABLE "SellerQnA" ADD CONSTRAINT "SellerQnA_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
