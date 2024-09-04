/*
  Warnings:

  - You are about to drop the `PreviousYearNetProfit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreviousYearNetSales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PreviousYearRevenue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PreviousYearNetProfit" DROP CONSTRAINT "PreviousYearNetProfit_financialId_fkey";

-- DropForeignKey
ALTER TABLE "PreviousYearNetSales" DROP CONSTRAINT "PreviousYearNetSales_financialId_fkey";

-- DropForeignKey
ALTER TABLE "PreviousYearRevenue" DROP CONSTRAINT "PreviousYearRevenue_financialId_fkey";

-- DropTable
DROP TABLE "PreviousYearNetProfit";

-- DropTable
DROP TABLE "PreviousYearNetSales";

-- DropTable
DROP TABLE "PreviousYearRevenue";

-- CreateTable
CREATE TABLE "PreviousYearValues" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "financialId" TEXT NOT NULL,

    CONSTRAINT "PreviousYearValues_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreviousYearValues" ADD CONSTRAINT "PreviousYearValues_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
