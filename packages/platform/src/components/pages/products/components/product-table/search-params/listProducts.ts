import { createLoader, parseAsInteger } from "nuqs/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/common";

export const listProductsParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export const listProductsSearchParamsLoader = createLoader(listProductsParser);
