/*
  Warnings:

  - You are about to drop the column `description` on the `Accessory` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Accessory` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `SparePart` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SparePart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accessory" DROP COLUMN "description",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "SparePart" DROP COLUMN "description",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "AccessoryTranslation" (
    "id" TEXT NOT NULL,
    "accessoryId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "AccessoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SparePartTranslation" (
    "id" TEXT NOT NULL,
    "sparePartId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SparePartTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessoryTranslation_locale_idx" ON "AccessoryTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "AccessoryTranslation_accessoryId_locale_key" ON "AccessoryTranslation"("accessoryId", "locale");

-- CreateIndex
CREATE INDEX "SparePartTranslation_locale_idx" ON "SparePartTranslation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "SparePartTranslation_sparePartId_locale_key" ON "SparePartTranslation"("sparePartId", "locale");

-- AddForeignKey
ALTER TABLE "AccessoryTranslation" ADD CONSTRAINT "AccessoryTranslation_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SparePartTranslation" ADD CONSTRAINT "SparePartTranslation_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
