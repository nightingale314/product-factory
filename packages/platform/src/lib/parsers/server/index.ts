import { createParser } from "nuqs/server";

// "100:cm" -> { value: 100, unit: "cm" }
export const parseAsMeasure = createParser({
  parse(queryValue) {
    const [num, unit] = queryValue.split(":");
    if (!isNaN(Number(num)) && unit) {
      return { value: Number(num), unit };
    }
    return null;
  },
  serialize(value) {
    return `${value.value}:${value.unit}`;
  },
});

// "100,200" -> { min: 100, max: 200 }
export const parseAsRange = createParser({
  parse(queryValue) {
    const [min, max] = queryValue.split(",").map(Number);
    return { min, max };
  },
  serialize(value) {
    return `${value.min},${value.max}`;
  },
});

// "a|b|c" -> ["a", "b", "c"]
export const parseAsMultiString = createParser({
  parse(queryValue) {
    return queryValue.split("|").filter(Boolean);
  },
  serialize(value) {
    return value.join("|");
  },
});
