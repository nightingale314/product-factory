import { Product, ProductAttribute, ProductImportTask } from "@prisma/client";
import { ServerResponse } from "./common";

export type ProductWithAttributes = Product & {
  attributes: ProductAttribute[];
};

export type GetActiveImportOutput = ServerResponse<ProductImportTask>;

export interface GetImportTaskInput {
  taskId: string;
}

export type GetImportTaskOutput = ServerResponse<ProductImportTask>;
