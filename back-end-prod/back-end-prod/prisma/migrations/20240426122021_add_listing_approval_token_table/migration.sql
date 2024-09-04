-- CreateTable
CREATE TABLE "ListingApprovalToken" (
    "id" SERIAL NOT NULL,
    "listingId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted" BOOLEAN NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ListingApprovalToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListingApprovalToken" ADD CONSTRAINT "ListingApprovalToken_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
