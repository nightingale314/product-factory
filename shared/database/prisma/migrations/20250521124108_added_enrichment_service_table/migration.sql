-- CreateEnum
CREATE TYPE "EnrichmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ProductLastUpdatedBy" AS ENUM ('USER', 'ENRICHMENT');

-- CreateTable
CREATE TABLE "enrichment_task" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "productIds" TEXT[],
    "attributeIds" TEXT[],
    "status" "EnrichmentStatus" NOT NULL,

    CONSTRAINT "enrichment_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute_change_log" (
    "productAttributeId" TEXT NOT NULL,
    "oldValue" JSONB NOT NULL,
    "newValue" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" "ProductLastUpdatedBy",
    "updatedByReferenceId" TEXT,

    CONSTRAINT "product_attribute_change_log_pkey" PRIMARY KEY ("productAttributeId")
);

-- CreateIndex
CREATE INDEX "enrichment_task_supplierId_idx" ON "enrichment_task"("supplierId");

-- AddForeignKey
ALTER TABLE "enrichment_task" ADD CONSTRAINT "enrichment_task_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_change_log" ADD CONSTRAINT "product_attribute_change_log_productAttributeId_fkey" FOREIGN KEY ("productAttributeId") REFERENCES "product_attribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
