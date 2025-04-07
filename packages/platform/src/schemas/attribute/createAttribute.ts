import { AttributeType } from "@prisma/client";
import { z } from "zod";

export const measureAttributeConfigSchema = z
  .object({
    unit: z.array(z.string().min(1)),
  })
  .optional();

export const createAttributeSchema = z
  .object({
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
    measureConfig: measureAttributeConfigSchema,
  })
  .refine(
    (data) => {
      if (
        data.type === AttributeType.SINGLE_SELECT ||
        data.type === AttributeType.MULTI_SELECT
      ) {
        return (
          data.selectOptions !== undefined && data.selectOptions.length > 0
        );
      }
      return true;
    },
    {
      message: "At least one option is required",
      path: ["selectOptions"],
    }
  );

export type CreateAttributeSchema = z.infer<typeof createAttributeSchema>;
export type MeasureAttributeConfigSchema = z.infer<
  typeof measureAttributeConfigSchema
>;
