-- AlterTable
ALTER TABLE "Financial" ADD COLUMN     "customerAcquisitionCost" DECIMAL(65,30),
ADD COLUMN     "roi" DECIMAL(65,30),
ADD COLUMN     "totalAssetValue" DECIMAL(65,30),
ADD COLUMN     "totalInventoryValue" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "businessStage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "entityType" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "PreviousYearRevenue" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "financialId" TEXT NOT NULL,

    CONSTRAINT "PreviousYearRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviousYearNetProfit" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "financialId" TEXT NOT NULL,

    CONSTRAINT "PreviousYearNetProfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviousYearNetSales" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "financialId" TEXT NOT NULL,

    CONSTRAINT "PreviousYearNetSales_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreviousYearRevenue" ADD CONSTRAINT "PreviousYearRevenue_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviousYearNetProfit" ADD CONSTRAINT "PreviousYearNetProfit_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviousYearNetSales" ADD CONSTRAINT "PreviousYearNetSales_financialId_fkey" FOREIGN KEY ("financialId") REFERENCES "Financial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
