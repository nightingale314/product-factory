-- AlterTable
ALTER TABLE "product" ADD COLUMN     "latestEnrichmentTaskId" TEXT;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_latestEnrichmentTaskId_fkey" FOREIGN KEY ("latestEnrichmentTaskId") REFERENCES "enrichment_task"("id") ON DELETE SET NULL ON UPDATE CASCADE;
