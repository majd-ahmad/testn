-- CreateTable
CREATE TABLE "AccountProfilePicture" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileName" TEXT NOT NULL,
    "filesSize" INTEGER,

    CONSTRAINT "AccountProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountProfilePicture_accountId_key" ON "AccountProfilePicture"("accountId");

-- AddForeignKey
ALTER TABLE "AccountProfilePicture" ADD CONSTRAINT "AccountProfilePicture_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
