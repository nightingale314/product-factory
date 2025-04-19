import { Attribute } from "@prisma/client";
import { RESERVED_ATTRIBUTE_IDS } from "../enums";

export const isReservedAttribute = (
  attributeId: string
): attributeId is RESERVED_ATTRIBUTE_IDS => {
  return Object.values(RESERVED_ATTRIBUTE_IDS).includes(
    attributeId as RESERVED_ATTRIBUTE_IDS
  );
};

export const parseAttributeValue = (
  value: string,
  attribute: Attribute
): unknown => {
  const { type } = attribute;

  try {
    switch (type) {
      case "NUMBER": {
        return Number(value);
      }
      case "BOOLEAN": {
        return value.toLowerCase() === "true";
      }
      case "DATE": {
        return new Date(value).toISOString().split("T")[0];
      }
      case "DATETIME": {
        return new Date(value).toISOString();
      }

      case "SINGLE_SELECT": {
        return value;
      }

      case "MULTI_SELECT": {
        return value
          .split(",")
          .map((v) => v.trim())
          .filter((i) => !!i);
      }
      case "MEASURE": {
        const [val, unit] = value.split(" ");
        return { value: Number(val), unit };
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
