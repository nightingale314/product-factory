import {
  attributeBooleanSchema,
  attributeLongTextSchema,
  attributeMeasureSchema,
  attributeMultiSelectSchema,
  attributeNumberSchema,
  attributeShortTextSchema,
} from "@/schemas/product/productAttribute";
import { AttributeType } from "@prisma/client";

interface UseValidatorProps {
  type: AttributeType;
  required: boolean;
}

const isEmpty = (value: unknown) => {
  if (typeof value === "string") {
    return value.length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object" && value !== null) {
    return Object.keys(value).length === 0;
  }

  return value === null || value === undefined;
};

export const useValidator = ({ type, required }: UseValidatorProps) => {
  const validate = <T>(
    value: unknown
  ): { data: T | null; error: string | undefined } => {
    const isEmptyValue = isEmpty(value);

    if (isEmptyValue) {
      if (required) {
        return {
          data: null,
          error: "This field is required",
        };
      }

      return {
        data: null,
        error: undefined,
      };
    }

    switch (type) {
      case AttributeType.SHORT_TEXT:
      case AttributeType.LONG_TEXT: {
        const result =
          type === AttributeType.SHORT_TEXT
            ? attributeShortTextSchema.safeParse(value)
            : attributeLongTextSchema.safeParse(value);

        return {
          data: result.data as T,
          error: result.error?.errors?.[0]?.message,
        };
      }

      case AttributeType.MULTI_SELECT: {
        const result = attributeMultiSelectSchema.safeParse(value);

        return {
          data: result.data as T,
          error: result.error?.errors?.[0]?.message,
        };
      }
      case AttributeType.NUMBER: {
        const result = attributeNumberSchema.safeParse(Number(value));

        return {
          data: result.data as T,
          error: result.error?.errors?.[0]?.message,
        };
      }
      case AttributeType.MEASURE: {
        const result = attributeMeasureSchema.safeParse(value);

        return {
          data: result.data as T,
          error: result.error?.errors?.[0]?.message,
        };
      }

      case AttributeType.BOOLEAN: {
        const result = attributeBooleanSchema.safeParse(value);

        return {
          data: result.data as T,
          error: result.error?.errors?.[0]?.message,
        };
      }
      default:
        break;
    }

    return {
      data: null,
      error: undefined,
    };
  };
  return validate;
};
