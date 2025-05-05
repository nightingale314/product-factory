import { Attribute, Prisma } from "@prisma/client";
import { RESERVED_ATTRIBUTE_IDS } from "../enums";
import { InputJsonValue } from "@prisma/client/runtime/library";

export const isReservedAttribute = (
  attributeId: string
): attributeId is RESERVED_ATTRIBUTE_IDS => {
  return Object.values(RESERVED_ATTRIBUTE_IDS).includes(
    attributeId as RESERVED_ATTRIBUTE_IDS
  );
};

export const parseAttributeValue = ({
  value,
  attribute,
}: {
  value?: string | null;
  attribute: Attribute;
}): InputJsonValue | null => {
  const { type } = attribute;

  if (value === null || value === undefined || value === "") {
    return null;
  }

  try {
    switch (type) {
      case "NUMBER": {
        if (Number.isNaN(Number(value))) {
          return null;
        }

        return Number(value);
      }
      case "BOOLEAN": {
        return value.toLowerCase() === "true";
      }
      case "DATE": {
        if (Number.isNaN(new Date(value).getTime())) {
          return null;
        }

        return new Date(value).getTime();
      }

      case "SINGLE_SELECT": {
        if (attribute.selectOptions.includes(value.trim())) {
          return value.trim();
        }

        return null;
      }

      case "MULTI_SELECT": {
        const parsedValue = value
          .split(",")
          .map((v) => v.trim())
          .filter((i) => !!i);

        if (parsedValue.every((i) => attribute.selectOptions.includes(i))) {
          return parsedValue;
        }

        return null;
      }
      case "MEASURE": {
        const [val, unit] = value.split(" ");

        if (attribute.measureUnits.includes(unit.trim())) {
          if (Number.isNaN(Number(val))) {
            return null;
          }

          return { value: Number(val), unit: unit.trim() };
        }

        return null;
      }
      case "MEDIA": {
        return value
          .split(",")
          .map((v) => v.trim())
          .filter((i) => !!i);
      }

      case "HTML":
      case "LONG_TEXT":
      case "SHORT_TEXT": {
        return value;
      }

      default:
        return null;
    }
  } catch (err) {
    return null;
  }
};
