"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { encodeQuery, decodeQuery } from "@/lib/parsers/parsers";
import { QueryValue } from "@/lib/parsers/types";

type UseQueryParamsOptions = {
  initialQueryValues?: Map<string, QueryValue>;
};

export function useQueryParams({
  initialQueryValues,
}: UseQueryParamsOptions = {}): {
  queryValues: Map<string, QueryValue>;
  setQueryValues: (queryValuesToBeInserted: QueryValue[]) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParamsHook = useSearchParams();

  const searchParams = useMemo(
    () => new URLSearchParams(searchParamsHook.toString()),
    [searchParamsHook]
  );

  const [queryValues, setQueryValuesState] = useState<Map<string, QueryValue>>(
    () => initialQueryValues ?? decodeQuery(searchParams)
  );

  useEffect(() => {
    const fresh = decodeQuery(new URLSearchParams(searchParamsHook.toString()));
    setQueryValuesState(fresh);
  }, [searchParamsHook]);

  const setQueryValues = useCallback(
    (queryValuesToBeInserted: QueryValue[]) => {
      const updatedMap = new Map(queryValues);
      queryValuesToBeInserted.forEach((queryValue) => {
        updatedMap.set(queryValue.key, queryValue);
      });

      setQueryValuesState(updatedMap);

      const updated = encodeQuery({
        queryValues: queryValuesToBeInserted,
      });

      router.replace(`${pathname}?${updated.toString()}`);
    },
    [queryValues, router, pathname]
  );

  return { queryValues, setQueryValues };
}
