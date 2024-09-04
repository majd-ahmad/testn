-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SELLER', 'BUYER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EU');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isValid" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role"[],
    "currency" "Currency" NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "profilePicture" TEXT NOT NULL DEFAULT '',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "seller_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seller" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessDetails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "isStartup" BOOLEAN NOT NULL,
    "industry_type" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "listing_type" TEXT NOT NULL,
    "established_date" TIMESTAMP(3) NOT NULL,
    "entity_type" TEXT NOT NULL,
    "businessOverview" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "listing_id" TEXT NOT NULL,

    CONSTRAINT "BusinessDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Financials" (
    "id" TEXT NOT NULL,
    "last_year_revenue" DECIMAL(65,30) NOT NULL,
    "last_year_sales" DECIMAL(65,30) NOT NULL,
    "last_year_profit" DECIMAL(65,30) NOT NULL,
    "ebitda" DECIMAL(65,30),
    "isDebt" BOOLEAN NOT NULL,
    "totalDebt" DECIMAL(65,30),
    "listing_id" TEXT NOT NULL,

    CONSTRAINT "Financials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingFiles" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "files_type" TEXT NOT NULL,
    "files_size" INTEGER,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingFiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPhoto" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "ListingPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPdf" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "ListingPdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_seller_id_key" ON "Account"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetails_listing_id_key" ON "BusinessDetails"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "Financials_listing_id_key" ON "Financials"("listing_id");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPhoto_file_id_key" ON "ListingPhoto"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "ListingPdf_file_id_key" ON "ListingPdf"("file_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessDetails" ADD CONSTRAINT "BusinessDetails_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Financials" ADD CONSTRAINT "Financials_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPhoto" ADD CONSTRAINT "ListingPhoto_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "ListingFiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPdf" ADD CONSTRAINT "ListingPdf_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "ListingFiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
