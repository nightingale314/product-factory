/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `product_import_task` table. All the data in the column will be lost.
  - Added the required column `fileKey` to the `product_import_task` table without a default value. This is not possible if the table is not empty.
  - Made the column `selectedHeaderIndex` on table `product_import_task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_import_task" DROP COLUMN "fileUrl",
ADD COLUMN     "fileKey" TEXT NOT NULL,
ALTER COLUMN "selectedHeaderIndex" SET NOT NULL,
ALTER COLUMN "selectedHeaderIndex" DROP DEFAULT;
