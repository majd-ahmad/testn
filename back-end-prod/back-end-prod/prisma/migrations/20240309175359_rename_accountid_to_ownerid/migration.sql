/*
  Warnings:

  - You are about to drop the column `accountId` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_accountId_fkey";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "accountId",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
