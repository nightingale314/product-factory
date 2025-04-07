import { createLoader, parseAsInteger } from "nuqs/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants/common";

export const listAtttributesParser = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export const listAttributesSearchParamsLoader = createLoader(
  listAtttributesParser
);
