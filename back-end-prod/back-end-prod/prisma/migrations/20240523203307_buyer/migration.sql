-- AlterTable
ALTER TABLE "EmailVerificationCode" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + interval '15 min';

-- CreateTable
CREATE TABLE "Buyer" (
    "id" TEXT NOT NULL,
    "interestedIn" TEXT NOT NULL,
    "businessStage" TEXT NOT NULL,
    "preferredIndustry" TEXT[],
    "preferredCountry" TEXT NOT NULL,
    "preferredCities" TEXT[],
    "aboutBuyer" TEXT NOT NULL,
    "aspectsLookedInto" TEXT NOT NULL,
    "investmentRange" TEXT NOT NULL,
    "preferredTimeFrame" TEXT,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Buyer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Buyer" ADD CONSTRAINT "Buyer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
