/*
  Warnings:

  - A unique constraint covering the columns `[orderId,scooterId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,accessoryId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,sparePartId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Made the column `postalCode` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('SCOOTER', 'ACCESSORY', 'SPARE_PART');

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_accessoryId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_scooterId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_sparePartId_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "postalCode" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "productImage" TEXT,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productType" "ProductType" NOT NULL;

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "OrderItem_scooterId_idx" ON "OrderItem"("scooterId");

-- CreateIndex
CREATE INDEX "OrderItem_accessoryId_idx" ON "OrderItem"("accessoryId");

-- CreateIndex
CREATE INDEX "OrderItem_sparePartId_idx" ON "OrderItem"("sparePartId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_scooterId_key" ON "OrderItem"("orderId", "scooterId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_accessoryId_key" ON "OrderItem"("orderId", "accessoryId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_sparePartId_key" ON "OrderItem"("orderId", "sparePartId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_scooterId_fkey" FOREIGN KEY ("scooterId") REFERENCES "Scooter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_accessoryId_fkey" FOREIGN KEY ("accessoryId") REFERENCES "Accessory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_sparePartId_fkey" FOREIGN KEY ("sparePartId") REFERENCES "SparePart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
