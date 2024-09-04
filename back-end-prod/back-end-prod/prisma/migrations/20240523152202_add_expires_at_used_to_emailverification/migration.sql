-- AlterTable
ALTER TABLE "EmailVerificationCode" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '15 min',
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
