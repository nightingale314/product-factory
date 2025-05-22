/*
  Warnings:

  - You are about to drop the column `newValue` on the `product_attribute_change_log` table. All the data in the column will be lost.
  - You are about to drop the column `oldValue` on the `product_attribute_change_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_attribute_change_log" DROP COLUMN "newValue",
DROP COLUMN "oldValue";
