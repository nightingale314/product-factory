import { ProductImportTask } from "@prisma/client";
import { ServerResponse } from "./common";

export type GetActiveImportOutput = ServerResponse<ProductImportTask>;

export interface GetImportTaskInput {
  taskId: string;
}

export type GetImportTaskOutput = ServerResponse<ProductImportTask>;
