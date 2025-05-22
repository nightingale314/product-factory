/*
  Warnings:

  - A unique constraint covering the columns `[supplierId,skuId]` on the table `product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "product_skuId_key";

-- CreateIndex
CREATE UNIQUE INDEX "product_supplierId_skuId_key" ON "product"("supplierId", "skuId");
