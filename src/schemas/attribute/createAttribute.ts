import { AttributeType } from "@prisma/client";
import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  type: z.nativeEnum(AttributeType),
  required: z.boolean(),
  enrichmentEnabled: z.boolean(),
  enrichmentInstructions: z.string().optional(),
});

export type CreateAttributeSchema = z.infer<typeof createAttributeSchema>;
