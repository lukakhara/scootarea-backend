/*
  Warnings:

  - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accessory" ADD COLUMN     "discountEndsAt" TIMESTAMP(3),
ADD COLUMN     "discountPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "price",
ADD COLUMN     "unitPrice" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "Scooter" ADD COLUMN     "discountEndsAt" TIMESTAMP(3),
ADD COLUMN     "discountPrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "SparePart" ADD COLUMN     "discountEndsAt" TIMESTAMP(3),
ADD COLUMN     "discountPrice" DECIMAL(10,2);
