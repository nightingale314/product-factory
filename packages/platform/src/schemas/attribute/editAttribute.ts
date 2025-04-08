import { z } from "zod";
import { measureAttributeConfigSchema } from "./createAttribute";

export const editAttributeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean(),
  enrichmentEnabled: z.boolean(),
  enrichmentInstructions: z.string().optional(),
  selectOptions: z
    .array(z.string())
    .refine((val) => new Set(val).size === val.length, {
      message: "Options must be unique",
    })
    .optional(),
  measureConfig: measureAttributeConfigSchema,
});

export type EditAttributeSchema = z.infer<typeof editAttributeSchema>;
