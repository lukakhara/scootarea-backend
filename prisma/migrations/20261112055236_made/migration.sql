/*
  Warnings:

  - Made the column `coverImage` on table `BlogPost` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BlogPost" ALTER COLUMN "coverImage" SET NOT NULL;
