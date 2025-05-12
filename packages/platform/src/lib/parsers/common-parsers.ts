import { QueryType } from "./enums";
import { createQueryParser } from "./helpers";

export const paginationParser = createQueryParser({
  page: QueryType.NUMBER,
  pageSize: QueryType.NUMBER,
});
