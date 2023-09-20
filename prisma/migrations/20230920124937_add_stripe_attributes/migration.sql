/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "status" TEXT,
    "priceId" TEXT,
    "quantity" INTEGER,
    "cancelAtPeriodEnd" BOOLEAN,
    "created" TEXT NOT NULL,
    "currentPeriodStart" TEXT NOT NULL,
    "currentPeriodEnd" TEXT NOT NULL,
    "endedAt" TEXT,
    "cancelAt" TEXT,
    "canceledAt" TEXT,
    "trialStart" TEXT,
    "trialEnd" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
