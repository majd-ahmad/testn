/*
  Warnings:

  - You are about to drop the column `seller_id` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `seller_id` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the `Seller` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_seller_id_fkey";

-- DropIndex
DROP INDEX "Account_seller_id_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "seller_id";

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "seller_id",
ADD COLUMN     "accountId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Seller";

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
