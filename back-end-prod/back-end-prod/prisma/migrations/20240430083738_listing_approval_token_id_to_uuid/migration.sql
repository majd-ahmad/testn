/*
  Warnings:

  - The primary key for the `ListingApprovalToken` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ListingApprovalToken" DROP CONSTRAINT "ListingApprovalToken_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ListingApprovalToken_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ListingApprovalToken_id_seq";
