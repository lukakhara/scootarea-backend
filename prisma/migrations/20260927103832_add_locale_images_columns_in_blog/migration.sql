/*
  Warnings:

  - You are about to drop the column `category` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `BlogPost` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug,locale]` on the table `BlogPost` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "BlogPost_slug_key";

-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "category",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "views",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_locale_key" ON "BlogPost"("slug", "locale");
