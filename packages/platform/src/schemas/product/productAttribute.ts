import { z } from "zod";

export const attributeShortTextSchema = z.string().max(50, {
  message: "Short text must be less than 50 characters",
});
export const attributeLongTextSchema = z.string().max(2000, {
  message: "Long text must be less than 2000 characters",
});

export const attributeNumberSchema = z.number().min(0, {
  message: "Number must be greater than 0",
});

export const attributeBooleanSchema = z.boolean();

export const attributeMultiSelectSchema = z.array(z.string());
