/*
  Warnings:

  - You are about to drop the `ProductImportTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductImportTask" DROP CONSTRAINT "ProductImportTask_supplierId_fkey";

-- DropTable
DROP TABLE "ProductImportTask";

-- CreateTable
CREATE TABLE "product_import_task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "step" "ProductImportStep",
    "selectedHeaderRowIndex" INTEGER NOT NULL,
    "mappings" JSONB NOT NULL,
    "totalProductsImported" INTEGER NOT NULL,
    "aborted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "product_import_task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_import_task_supplierId_idx" ON "product_import_task"("supplierId");

-- AddForeignKey
ALTER TABLE "product_import_task" ADD CONSTRAINT "product_import_task_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
