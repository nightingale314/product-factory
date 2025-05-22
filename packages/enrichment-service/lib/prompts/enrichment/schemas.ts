import { z, ZodLiteral } from "zod";

export const buildSelectSchema = (options: string[]) => {
  if (options.length === 0) {
    return null;
  }

  if (options.length === 1) {
    return z.literal(options[0]).nullable();
  }
  const literals = options.map((opt) => z.literal(opt));
  return z.union([literals[0], literals[1], ...literals.slice(2)]).nullable();
};

export const buildMultiSelectSchema = (options: string[]) => {
  if (options.length === 0) {
    return null;
  }

  // Map with explicit typing to satisfy TS
  const literals: [
    ZodLiteral<string>,
    ZodLiteral<string>,
    ...ZodLiteral<string>[]
  ] = [
    z.literal(options[0]),
    z.literal(options[1]),
    ...(options.slice(2).map((opt) => z.literal(opt)) as ZodLiteral<string>[]),
  ];

  const valueSchema = z.union(literals);

  return z.array(valueSchema).nullable();
};

export const buildMeasureSchema = (units: string[]) => {
  if (units.length === 0) {
    return null;
  }
  if (units.length === 1) {
    return z
      .object({
        value: z.number(),
        unit: z.literal(units[0]),
      })
      .nullable()
      .describe(
        "This is a factual data, accuracy is paramount. Return null if value cannot be determined with high confidence"
      );
  }
  const literals = units.map((opt) => z.literal(opt));

  return z
    .object({
      value: z.number(),
      unit: z.union([literals[0], literals[1], ...literals.slice(2)]),
    })
    .nullable();
};

export const buildBooleanSchema = () => {
  return z.boolean().nullable();
};

export const buildLongTextSchema = () => {
  return z
    .string()
    .max(2000)
    .nullable()
    .describe(
      "This is a plain text string, should not contain any rich text formatting."
    );
};

export const buildShortTextSchema = () => {
  return z.string().max(50).nullable();
};

export const buildNumberSchema = () => {
  return z
    .number()
    .nullable()
    .describe(
      "This is a factual data, accuracy is paramount. Return null if value cannot be determined with high confidence"
    );
};

export const buildHtmlSchema = () => {
  return z.string().nullable().describe("Must be valid HTML content");
};
