/*
  Warnings:

  - Added the required column `termsAcceptedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `termsVersion` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "termsVersion" TEXT NOT NULL;
