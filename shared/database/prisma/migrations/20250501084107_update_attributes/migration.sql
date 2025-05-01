-- First handle the dependent tables
ALTER TABLE "product" DROP COLUMN IF EXISTS "type";
ALTER TABLE "product_attribute" DROP COLUMN IF EXISTS "type";
DROP INDEX IF EXISTS "product_attribute_type_idx";

-- Then handle the enum change
DROP TYPE IF EXISTS "AttributeType_new";
CREATE TYPE "AttributeType_new" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'SINGLE_SELECT', 'MULTI_SELECT', 'HTML', 'MEASURE', 'MEDIA');
ALTER TABLE "attributes" ALTER COLUMN "type" TYPE "AttributeType_new" USING ("type"::text::"AttributeType_new");
ALTER TYPE "AttributeType" RENAME TO "AttributeType_old";
ALTER TYPE "AttributeType_new" RENAME TO "AttributeType";
DROP TYPE "AttributeType_old";

-- Rest of your changes
ALTER TYPE "ProductImportStep" ADD VALUE 'MAPPING_GENERATION';
ALTER TABLE "attributes" ADD COLUMN IF NOT EXISTS "measureUnits" TEXT[];
ALTER TABLE "product_import_task" 
    DROP COLUMN IF EXISTS "selectedHeaderRowIndex",
    ADD COLUMN "rowWithIssues" JSONB,
    ADD COLUMN "selectedHeaderIndex" INTEGER DEFAULT 0,
    ALTER COLUMN "mappings" DROP NOT NULL,
    ALTER COLUMN "totalProductsImported" DROP NOT NULL;

DROP TABLE IF EXISTS "attribute_measure" CASCADE;