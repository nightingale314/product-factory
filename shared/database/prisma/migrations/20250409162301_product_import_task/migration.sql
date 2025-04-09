-- CreateEnum
CREATE TYPE "ProductImportStep" AS ENUM ('MAPPING_SELECTION', 'PRODUCT_IMPORT', 'COMPLETED');

-- CreateTable
CREATE TABLE "ProductImportTask" (
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

    CONSTRAINT "ProductImportTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductImportTask_supplierId_idx" ON "ProductImportTask"("supplierId");

-- AddForeignKey
ALTER TABLE "ProductImportTask" ADD CONSTRAINT "ProductImportTask_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
