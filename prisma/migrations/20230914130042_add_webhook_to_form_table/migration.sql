-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "webhookEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "webhookUrl" TEXT;
