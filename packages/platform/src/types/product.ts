import { Product, ProductAttribute, ProductImportTask } from "@prisma/client";
import { ServerResponse } from "./common";
import { ImportProductsAttributeMapping } from "@product-factory/import-service/lib/generateProductsFromMappings";

export type ProductWithAttributes = Product & {
  attributes: ProductAttribute[];
};

export type GetActiveImportOutput = ServerResponse<ProductImportTask>;

export interface GetImportTaskInput {
  taskId: string;
}

export type GetImportTaskOutput = ServerResponse<ProductImportTask>;

export type CreateImportTaskInput = {
  fileKey?: string;
  taskType: "IMPORT" | "GENERATE_MAPPINGS";
  taskId?: string;
  headerIndex?: number;
  selectedMappings?: ImportProductsAttributeMapping[];
};

export type CreateImportTaskOutput = ServerResponse<ProductImportTask>;

export type CancelImportTaskInput = {
  taskId: string;
};

export type CancelImportTaskOutput = ServerResponse<ProductImportTask>;
