import { SearchParams } from "next/dist/server/request/search-params";
import {
  AvailableRangeEndOperators,
  AvailableRangeStartOperators,
  decodeQuery,
  QueryValue,
} from "./parsers";
import { QueryType } from "./enums";

export type QueryValueByType<T extends QueryType> = T extends QueryType.STRING
  ? string
  : T extends QueryType.MULTI_STRING
  ? string[]
  : T extends QueryType.NUMBER
  ? number
  : T extends QueryType.RANGE
  ? {
      min?: {
        value: number;
        operator: AvailableRangeStartOperators;
      };
      max?: {
        value: number;
        operator: AvailableRangeEndOperators;
      };
    }
  : T extends QueryType.BOOLEAN
  ? boolean
  : never;

export function getQueryValue<T extends QueryType>(
  key: string,
  queryMap: Map<string, QueryValue>,
  type: T
): QueryValueByType<T> | null {
  const entry = queryMap.get(key);
  if (!entry || entry.type !== type) {
    return null;
  }

  if (type === QueryType.NUMBER) {
    const numberValue = Number(entry.value);
    if (isNaN(numberValue)) {
      return null;
    }
    return numberValue as QueryValueByType<T>;
  }

  return entry.value as QueryValueByType<T>;
}

export const loadQueryValues = async (searchParams: Promise<SearchParams>) => {
  const awaitedSearchParams = await searchParams;

  const urlSearchParams = new URLSearchParams(
    Object.entries(awaitedSearchParams).flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => [key, v] as [string, string])
        : ([[key, value]] as [string, string][])
    )
  );

  return decodeQuery(urlSearchParams);
};

export const createQueryParser = <T extends Record<string, QueryType>>(
  querySchema: T
) => {
  return (queryValues: Map<string, QueryValue>) => {
    const parsedQueryValue: Partial<
      Record<keyof T, QueryValueByType<T[keyof T]>>
    > = {};

    for (const key of queryValues.keys()) {
      const parsedValue = getQueryValue(key, queryValues, querySchema[key]);
      if (parsedValue !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (parsedQueryValue as any)[key] = parsedValue;
      }
    }

    return parsedQueryValue;
  };
};
