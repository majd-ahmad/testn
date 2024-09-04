/*
  Warnings:

  - You are about to drop the `Financials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Financials" DROP CONSTRAINT "Financials_listingId_fkey";

-- DropTable
DROP TABLE "Financials";

-- CreateTable
CREATE TABLE "Financial" (
    "id" TEXT NOT NULL,
    "lastYearRevenue" DECIMAL(65,30) NOT NULL,
    "lastYearSales" DECIMAL(65,30) NOT NULL,
    "lastYearProfit" DECIMAL(65,30) NOT NULL,
    "ebitda" DECIMAL(65,30),
    "isDebt" BOOLEAN NOT NULL,
    "totalDebt" DECIMAL(65,30),
    "listingId" TEXT NOT NULL,

    CONSTRAINT "Financial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Financial_listingId_key" ON "Financial"("listingId");

-- AddForeignKey
ALTER TABLE "Financial" ADD CONSTRAINT "Financial_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
