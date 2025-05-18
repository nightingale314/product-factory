import { Product, ProductAttribute, ProductImportTask } from "@prisma/client";
import {
  ServerResponse,
  ServerResponseList,
  WithPaginationSort,
} from "./common";
import { ImportProductsAttributeMapping } from "@product-factory/import-service/lib/generateProductsFromMappings";
import { QueryValue } from "@/lib/parsers/types";
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

export interface ListProductInput extends WithPaginationSort<Product> {
  filter?: QueryValue[];
}

export type ListProductOutput = ServerResponseList<ProductWithAttributes>;

export interface GetProductInput {
  skuId: string;
}

export type GetProductOutput = ServerResponse<ProductWithAttributes>;

export type UpdateProductInput = {
  id: string;
  skuId: string;
  name: string;
  attributes?: ProductAttribute[];
};

export type UpdateProductOutput = ServerResponse<ProductWithAttributes>;
