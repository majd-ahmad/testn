/*
  Warnings:

  - The primary key for the `PreviousYearValues` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "PreviousYearValues" DROP CONSTRAINT "PreviousYearValues_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PreviousYearValues_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PreviousYearValues_id_seq";
