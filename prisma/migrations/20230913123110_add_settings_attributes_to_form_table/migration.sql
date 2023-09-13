-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "customRedirect" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "customRedirectUrl" TEXT,
ADD COLUMN     "fromName" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "respondentEmailNotification" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subject" TEXT;
