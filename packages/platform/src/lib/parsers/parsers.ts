import { QueryOperator, QueryType } from "./enums";
import {
  AvailableRangeEndOperators,
  AvailableRangeStartOperators,
  QueryValue,
} from "./types";

const getOperatorEncoding = (operator: QueryOperator, key: string) => {
  switch (operator) {
    case QueryOperator.EQUALS:
      return key;
    case QueryOperator.NOT_EQUALS:
      return `${key}[neq]`;
    case QueryOperator.IN:
      return `${key}[in]`;
    case QueryOperator.NOT_IN:
      return `${key}[nin]`;
    case QueryOperator.GREATER_THAN:
      return `${key}[gt]`;
    case QueryOperator.LESS_THAN:
      return `${key}[lt]`;
    case QueryOperator.GREATER_THAN_OR_EQUAL:
      return `${key}[gte]`;
    case QueryOperator.LESS_THAN_OR_EQUAL:
      return `${key}[lte]`;
    case QueryOperator.CONTAINS:
      return `${key}[con]`;
  }
};

const getOperatorFromQueryKey = (
  queryKey: string
): { key: string; operator: QueryOperator } => {
  const match = queryKey.match(
    /^(.*?)(?:\[(neq|in|nin|gt|lt|gte|lte|con)\])?$/
  );
  if (!match) {
    return { key: queryKey, operator: QueryOperator.EQUALS };
  }

  const [, key, op] = match;
  switch (op) {
    case "neq":
      return { key, operator: QueryOperator.NOT_EQUALS };
    case "in":
      return { key, operator: QueryOperator.IN };
    case "nin":
      return { key, operator: QueryOperator.NOT_IN };
    case "gt":
      return { key, operator: QueryOperator.GREATER_THAN };
    case "lt":
      return { key, operator: QueryOperator.LESS_THAN };
    case "gte":
      return { key, operator: QueryOperator.GREATER_THAN_OR_EQUAL };
    case "lte":
      return { key, operator: QueryOperator.LESS_THAN_OR_EQUAL };
    case "con":
      return { key, operator: QueryOperator.CONTAINS };
    default:
      return { key, operator: QueryOperator.EQUALS };
  }
};

// This encoder uses a fresh searchParams object,
// Any existing values will be lost.
// If you want to append to an existing searchParams object,
// use the existingSearchParams parameter.

export const encodeQuery = ({
  queryValues,
  existingSearchParams,
}: {
  queryValues: QueryValue[];
  existingSearchParams?: URLSearchParams;
}): URLSearchParams => {
  const searchParams = new URLSearchParams(existingSearchParams);

  for (const qv of queryValues) {
    // handle deletion (null value)
    if (qv.value === null) {
      // remove any key or key[op] variants
      for (const name of Array.from(searchParams.keys())) {
        if (name === qv.key || name.startsWith(`${qv.key}[`)) {
          searchParams.delete(name);
        }
      }
      continue;
    }

    switch (qv.type) {
      case QueryType.STRING: {
        const key = getOperatorEncoding(qv.operator, qv.key);
        searchParams.append(key, qv.value);
        break;
      }

      case QueryType.MULTI_STRING: {
        const key = getOperatorEncoding(qv.operator, qv.key);
        for (const v of qv.value) {
          searchParams.append(key, v);
        }
        break;
      }

      case QueryType.RANGE: {
        if (qv.value.min) {
          const minKey = getOperatorEncoding(qv.value.min.operator, qv.key);
          searchParams.append(minKey, qv.value.min.value.toString());
        }
        if (qv.value.max) {
          const maxKey = getOperatorEncoding(qv.value.max.operator, qv.key);
          searchParams.append(maxKey, qv.value.max.value.toString());
        }
        break;
      }

      case QueryType.BOOLEAN: {
        // Boolean only supports EQUALS
        searchParams.append(qv.key, qv.value ? "TRUE" : "FALSE");
        break;
      }
    }
  }

  return searchParams;
};

export const decodeQuery = (
  searchParams: URLSearchParams
): Map<string, QueryValue> => {
  const map = new Map<string, QueryValue>();

  if (searchParams.size === 0) {
    return map;
  }

  for (const [rawKey, rawValue] of searchParams.entries()) {
    const { key, operator } = getOperatorFromQueryKey(rawKey);

    // Boolean
    if (rawValue === "TRUE" || rawValue === "FALSE") {
      map.set(key, {
        key,
        type: QueryType.BOOLEAN,
        operator: QueryOperator.EQUALS,
        value: rawValue === "TRUE",
      });
      continue;
    }

    // STRING / MULTI_STRING (First key of multi string is always string)
    if (
      operator === QueryOperator.EQUALS ||
      operator === QueryOperator.NOT_EQUALS ||
      operator === QueryOperator.CONTAINS
    ) {
      if (!map.has(key)) {
        // first time seeing it
        map.set(key, {
          key,
          type: QueryType.STRING,
          operator,
          value: rawValue,
        });
      } else {
        const existing = map.get(key)!;
        // if existing key is a string, and there is > 1 of the same key, it is a multi string.
        if (
          existing.type === QueryType.STRING &&
          existing.operator === QueryOperator.EQUALS
        ) {
          map.set(key, {
            key,
            type: QueryType.MULTI_STRING,
            operator: QueryOperator.IN,
            value: [existing.value as string, rawValue],
          });
        } else {
          // override for NOT_EQUALS or other mixes
          map.set(key, {
            key,
            type: QueryType.STRING,
            operator,
            value: rawValue,
          });
        }
      }
      continue;
    }

    // IN / NOT_IN
    if (operator === QueryOperator.IN || operator === QueryOperator.NOT_IN) {
      if (!map.has(key)) {
        map.set(key, {
          key,
          type: QueryType.MULTI_STRING,
          operator,
          value: [rawValue],
        });
      } else {
        const existing = map.get(key)!;
        if (existing.type === QueryType.MULTI_STRING) {
          map.set(key, {
            key,
            type: QueryType.MULTI_STRING,
            operator,
            value: [...existing.value, rawValue],
          });
        } else {
          // override if operator changed
          map.set(key, {
            key,
            type: QueryType.MULTI_STRING,
            operator,
            value: [rawValue],
          });
        }
      }
      continue;
    }

    // RANGE
    if (
      operator === QueryOperator.GREATER_THAN ||
      operator === QueryOperator.GREATER_THAN_OR_EQUAL ||
      operator === QueryOperator.LESS_THAN ||
      operator === QueryOperator.LESS_THAN_OR_EQUAL
    ) {
      const num = Number(rawValue);
      if (Number.isNaN(num)) {
        continue; // skip non-numeric
      }

      const isStart =
        operator === QueryOperator.GREATER_THAN ||
        operator === QueryOperator.GREATER_THAN_OR_EQUAL;
      const side: "min" | "max" = isStart ? "min" : "max";

      if (map.has(key)) {
        const existing = map.get(key)!;
        if (existing.type === QueryType.RANGE) {
          map.set(key, {
            ...existing,
            value: {
              ...existing.value,
              [side]: { value: num, operator },
            },
          });
        } else {
          map.set(key, {
            key,
            type: QueryType.RANGE,
            value: {
              [side]: { value: num, operator } as {
                value: number;
                operator:
                  | AvailableRangeStartOperators
                  | AvailableRangeEndOperators;
              },
            },
          });
        }
      }
      continue;
    }
  }

  return map;
};
