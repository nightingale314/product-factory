import { z } from "zod";

export const startEnrichmentTaskSchema = z.object({
  productIds: z.array(z.string()).min(1),
  attributeIds: z.array(z.string()).optional(),
});

export type StartEnrichmentTaskSchema = z.infer<
  typeof startEnrichmentTaskSchema
>;
