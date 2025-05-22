import { EnrichmentTask } from "@prisma/client";
import { ServerResponse } from "./common";

export type GetEnrichmentStatusInput = {
  taskId: string;
};

export type GetEnrichmentStatusOutput = ServerResponse<EnrichmentTask>;
