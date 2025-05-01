import { AttributeType } from "@prisma/client";
import { z } from "zod";

export const editAttributeSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(AttributeType),
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
  measureUnits: z
    .array(z.string())
    .refine((val) => new Set(val).size === val.length, {
      message: "Options must be unique",
    })
    .optional(),
});

export type EditAttributeSchema = z.infer<typeof editAttributeSchema>;
