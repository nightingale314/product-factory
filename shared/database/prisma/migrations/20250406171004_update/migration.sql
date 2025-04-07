/*
  Warnings:

  - You are about to drop the column `attributeId` on the `attribute_measure` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `attribute_measure` table. All the data in the column will be lost.
  - You are about to drop the `attribute_option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attribute_measure" DROP CONSTRAINT "attribute_measure_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "attribute_option" DROP CONSTRAINT "attribute_option_attributeId_fkey";

-- AlterTable
ALTER TABLE "attribute_measure" DROP COLUMN "attributeId",
DROP COLUMN "name";

-- AlterTable
ALTER TABLE "attributes" ADD COLUMN     "selectOptions" TEXT[],
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "attribute_option";

-- AddForeignKey
ALTER TABLE "attribute_measure" ADD CONSTRAINT "attribute_measure_id_fkey" FOREIGN KEY ("id") REFERENCES "attributes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
