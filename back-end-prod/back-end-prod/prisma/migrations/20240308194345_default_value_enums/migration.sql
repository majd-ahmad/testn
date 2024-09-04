-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "role" SET DEFAULT ARRAY[]::"Role"[],
ALTER COLUMN "currency" SET DEFAULT 'USD';
