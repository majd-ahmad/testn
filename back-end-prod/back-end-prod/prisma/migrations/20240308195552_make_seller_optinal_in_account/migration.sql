-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_seller_id_fkey";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "seller_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
